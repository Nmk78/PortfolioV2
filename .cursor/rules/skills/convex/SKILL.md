---
name: convex
description: Convex backend patterns. Use when writing queries, mutations, actions, or schema.
---

# Convex Backend

Inherits: `_core`

## Runtime Constraints

| Type | Timeout | Limit |
|------|---------|-------|
| Query | 1 second | 16,384 documents read |
| Mutation | 1 second | 8,192 documents write |
| Action | 10 minutes | 8 MiB arguments |

**Important:** Auth state does NOT propagate to scheduled jobs.

## Validators

```typescript
import { v } from "convex/values";

// Primitives
v.string()
v.number()
v.boolean()
v.null()

// References
v.id("tableName")          // Document ID

// Collections
v.array(v.string())
v.object({ key: v.string(), value: v.number() })

// Optional & Union
v.optional(v.string())
v.union(v.literal("active"), v.literal("archived"))

// Complex
v.any()                    // Avoid if possible
```

## Query

Fetch data from the database. Read-only, reactive.

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    userId: v.id("users"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Always use withIndex for filtering
    let q = ctx.db
      .query("items")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    // Additional filtering (after index)
    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await q.order("desc").collect();
  },
});

// Get single document
export const get = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

### Query Patterns

```typescript
// Get with index
const items = await ctx.db
  .query("items")
  .withIndex("by_user", (q) => q.eq("userId", args.userId))
  .collect();

// Pagination
const results = await ctx.db
  .query("items")
  .withIndex("by_created")
  .order("desc")
  .paginate(args.paginationOpts);

// Limit results
const recent = await ctx.db
  .query("items")
  .order("desc")
  .take(10);

// First match
const first = await ctx.db
  .query("items")
  .withIndex("by_email", (q) => q.eq("email", args.email))
  .first();
```

**Rule:** Use `withIndex`, never just `filter()`.

## Mutation

Modify database data. Transactional.

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Insert document
    const itemId = await ctx.db.insert("items", {
      name: args.name,
      description: args.description,
      userId: identity.subject,
      status: "active",
      createdAt: Date.now(),
    });

    return itemId;
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);
  },
});
```

### Mutation Operations

```typescript
// Insert - create new document
const id = await ctx.db.insert("items", { name: "New", createdAt: Date.now() });

// Patch - shallow merge (only updates specified fields)
await ctx.db.patch(id, { name: "Updated" });

// Replace - full document replacement (must include all fields)
await ctx.db.replace(id, { name: "Replaced", status: "active", createdAt: Date.now() });

// Delete - remove document
await ctx.db.delete(id);
```

## Action

For external integrations, HTTP calls, and long-running operations.

```typescript
"use node";  // Required for Node.js APIs

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const callExternalAPI = action({
  args: {
    input: v.string(),
  },
  handler: async (ctx, args) => {
    // Access environment variables
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY not configured");

    // Make external request
    const response = await fetch("https://api.example.com/endpoint", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: args.input }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    // Save results via internal mutation
    await ctx.runMutation(internal.items.saveResult, {
      data: result.data,
    });

    return result;
  },
});
```

## Internal Functions

For background processing and cross-function calls:

```typescript
import { internalMutation, internalQuery } from "./_generated/server";

export const saveResult = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.insert("results", { data: args.data, createdAt: Date.now() });
  },
});
```

## Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    createdAt: v.number(),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_email", ["email"]),

  items: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),
});
```

**Rule:** Add index for every field used in `withIndex` or sorting.

## HTTP Endpoints

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/webhook/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();

    // Process webhook
    await ctx.runMutation(internal.payments.processWebhook, { event: body });

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
```

## Best Practices

- Always use validators for all function arguments
- Store file IDs, not URLs in the database
- Use `ctx.runQuery` to call queries from mutations
- Use `ctx.runMutation` to call mutations from actions
- Use internal functions for scheduled/background work
- Add indexes for all filtered/sorted fields
- Keep functions focused and small
