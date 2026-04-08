---
name: api
description: HTTP API patterns. Use when creating API routes, webhooks, or HTTP endpoints.
---

# API Routes

Inherits: `_core`

## Next.js Route Handler

```typescript
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const CreateItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate
    const body = await request.json();
    const validated = CreateItemSchema.parse(body);

    // Process request (call Convex, external API, etc.)
    const result = await processItem(validated);

    // Success response
    return NextResponse.json({
      data: result,
      success: true,
    });
  } catch (error) {
    // Validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
          success: false,
        },
        { status: 400 }
      );
    }

    // Log detailed error server-side
    console.error("API Error:", error);

    // Generic error to client
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  // ... handle GET
}
```

## Dynamic Route Handler

```typescript
// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Fetch item by id
  const item = await getItem(id);

  if (!item) {
    return NextResponse.json(
      { error: "Not found", success: false },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: item, success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await deleteItem(id);

  return NextResponse.json({ success: true });
}
```

## Convex HTTP Endpoint

For webhooks and external integrations:

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Stripe webhook
http.route({
  path: "/webhook/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    const body = await request.text();

    // Verify and process webhook
    await ctx.runMutation(internal.payments.processStripeWebhook, {
      payload: body,
      signature,
    });

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// Public API endpoint
http.route({
  path: "/api/public/items",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "10");

    const items = await ctx.runQuery(internal.items.listPublic, { limit });

    return new Response(JSON.stringify({ data: items }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;
```

## Response Format

Consistent structure for all API responses:

```typescript
// Success response
{
  data: T,
  success: true
}

// Error response
{
  error: string,
  details?: unknown,  // Validation errors, etc.
  success: false
}

// Paginated response
{
  data: T[],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    hasMore: boolean
  },
  success: true
}
```

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

## Security Checklist

### Authentication
- [ ] Verify auth tokens before processing
- [ ] Handle missing tokens (401)
- [ ] Handle invalid/expired tokens (401)
- [ ] Use Convex auth context when available

### Authorization
- [ ] Check user roles/permissions (403)
- [ ] Verify resource ownership
- [ ] Implement least privilege principle

### Input Validation
- [ ] Validate all inputs with Zod
- [ ] Sanitize user inputs
- [ ] Limit payload sizes
- [ ] Validate content-type header

### Response Security
- [ ] Never expose stack traces to client
- [ ] Use generic error messages
- [ ] Log detailed errors server-side
- [ ] Consistent error format

## Authentication Pattern

```typescript
// With Clerk
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  // User is authenticated, proceed...
}
```

## Rate Limiting Pattern

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests", success: false },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  // Proceed with request...
}
```

## Best Practices

- Validate inputs early, before expensive operations
- Use proper HTTP status codes
- Keep route handlers thin (use services/Convex functions)
- Validate environment variables at startup
- Log requests for debugging (but not sensitive data)
