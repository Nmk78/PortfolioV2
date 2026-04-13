# ADR-0001: RAG with Pinecone and Vercel AI SDK

## Status

Accepted

## Context

The portfolio should support **grounded Q&A** over curated text (bio, project details, policies) without hallucinating facts beyond that corpus. Options include: managed vector DB (Pinecone, etc.), self-hosted vectors, or keyword-only search. The stack already uses Next.js on Vercel; embeddings and chat should integrate cleanly with TypeScript and streaming responses.

## Decision

Use **Pinecone** for vector storage and **Vercel AI SDK** (`ai`) for embeddings and chat completion, with **Groq (default), OpenAI, or Google** models selected via `RAG_AI_PROVIDER` and related env vars. **Groq** supplies chat only. **Embeddings** use **OpenAI** or **Gemini** via `RAG_EMBEDDING_PROVIDER` (default follows the chat provider: Gemini when `RAG_AI_PROVIDER=google`, otherwise OpenAI). Documents are **chunked** server-side with configurable size/overlap, then upserted with metadata for optional filtering.

## Consequences

### Positive

- Managed Pinecone reduces ops burden versus self-hosted vector stores.
- Vercel AI SDK unifies streaming and embedding calls with a consistent API.
- Namespaces isolate content (e.g. `portfolio`) for multiple use cases on one index.

### Negative

- Ongoing **cost** for Pinecone and token usage; requires monitoring and rate limits.
- **Vendor coupling** to Pinecone and chosen LLM provider; migration requires re-ingestion or dual-write planning.

### Neutral

- No first-party app database; **source of truth** for text remains repo/content unless a CMS is added later.

## Alternatives considered

- **Supabase pgvector / Postgres:** Strong if relational data and RAG coexist; rejected for current scope to avoid DB operations overhead for a portfolio-only deployment.
- **Keyword search only:** Cheaper but weaker semantic matching for natural-language questions.
- **Hosted RAG SaaS:** Faster to adopt but less control over chunking, costs, and custom metadata.

## References

- `src/lib/rag/service.ts`, `src/lib/rag/config.ts`
- Root `README.md` (env vars and curl examples)
