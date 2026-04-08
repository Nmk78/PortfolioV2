---
name: core
description: Foundation principles for this codebase. All other skills inherit these rules implicitly.
---

# Core Principles

## Project Structure

```
app/           → Routing only (thin pages that import from features)
features/      → Business logic + UI (colocated per feature)
  └── feature-name/
      ├── components/     → Feature-specific shared components
      ├── hooks/          → Feature-specific hooks
      ├── schema.ts       → Zod/validation schemas
      └── main-component.tsx
shared/        → Truly reusable code (3+ usages across features)
new-components/ui/  → shadcn/ui components
convex/        → Backend functions
```

## Colocation Principles

**Place code as close as possible to where it's used.**

| Type | Rule |
|------|------|
| State | Nearest component that uses it |
| Styles | With the component they affect |
| Tests | Next to the file they test |
| Hooks | In the feature folder that uses them |
| Utils | Start in-file, extract when reused |

### Decision Flow

```
Is it used by only 1 component?
  → Keep it in that component file

Is it used by 2-3 components in same feature?
  → Put in feature's components/ or hooks/ folder

Is it used by 3+ features?
  → Move to shared/
```

### Anti-Patterns

- Putting all hooks in a global `hooks/` folder
- Lifting state "just in case"
- Creating `utils/` functions before they're reused
- Separating UI from its logic across folders

## TypeScript Standards

- Strict mode enabled
- NO `any` types - use `unknown` if type is truly unknown
- Interface for props, type for unions/primitives
- Utility types: `Pick`, `Omit`, `Partial`, `Required`
- Explicit return types only for complex/exported functions

## File Conventions

- Folder names: kebab-case (`employer-intake`, not `employerIntake`)
- Component files: kebab-case (`intake-form.tsx`)
- Named exports preferred over default exports
- No barrel exports (index.ts) - import directly from files

## Import Order

```typescript
// 1. External packages (React, Next.js, libraries)
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SomeIcon } from "lucide-react";

// 2. Convex imports
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// 3. Custom hooks
import { useConvexQuery } from "@/hooks/useConvexQuery";

// 4. UI components
import { Button } from "@/new-components/ui/button";
import { Card, CardContent } from "@/new-components/ui/card";

// 5. Feature components (relative imports)
import { RelatedComponent } from "./components/related-component";

// 6. Types (if separate)
import type { SomeType } from "./types";
```

## Thin Pages Pattern

App pages should only import and render feature components:

```typescript
// app/(app)/dashboard/page.tsx
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export default function Page() {
  return <DashboardPage />;
}
```

## UI Component Source

Always import from `new-components/ui/` (not deprecated `components/` folder):

```typescript
import { Button } from "@/new-components/ui/button";
import { Card, CardContent, CardHeader } from "@/new-components/ui/card";
import { Skeleton } from "@/new-components/ui/skeleton";
```
