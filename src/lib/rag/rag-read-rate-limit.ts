import { createRateLimiter } from "@/lib/api/rate-limit";

/** Shared limiter for public RAG read routes (`/api/rag/chat`, `/api/rag/query`). */
export const ragReadRateLimiter = createRateLimiter({
  max: 15,
  windowMs: 60_000,
  storeMaxKeys: 5000,
});
