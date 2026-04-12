# ADR-0002: Next.js monolith and Route Handlers for APIs

## Status

Accepted

## Context

The product needs a **single deployable** that serves both the public site and small server endpoints (contact, RAG, monitoring). Alternatives include splitting a BFF, using serverless functions only, or adding a separate backend (e.g. Convex, Express).

## Decision

Keep a **Next.js monolith** using **App Router Route Handlers** (`src/app/api/**/route.ts`) for HTTP APIs. Share validation and rate-limit utilities from `src/lib`. Deploy on **Vercel** (or compatible Node hosting) as one application.

## Consequences

### Positive

- One repo, one pipeline, simple mental model for a solo-maintained portfolio.
- Colocated types and Zod schemas next to routes; fewer network hops than a separate API service.
- Native support for streaming in chat routes within the same runtime story as the app.

### Negative

- **Blast radius:** API changes deploy with the whole app; requires discipline and tests on routes.
- **Scaling:** Heavy RAG traffic shares resources with page serving unless split or edge-configured later.

### Neutral

- If the backend grows (auth, DB, queues), extracting a service remains possible without rewriting the front end.

## Alternatives considered

- **Separate Node API:** More isolation, but more infra and duplication for current scope.
- **Convex / BaaS:** Excellent for realtime DB; not required while content is static and vectors are in Pinecone.

## References

- `src/app/api/`
- `docs/architecture.md`
