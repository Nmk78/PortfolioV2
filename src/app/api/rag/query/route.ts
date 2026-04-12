import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getClientIp } from "@/lib/api/rate-limit";
import { RAG_MAX_QUERY_CHARS } from "@/lib/rag/limits";
import { ragMetadataFilterSchema } from "@/lib/rag/metadata-filter";
import { ragReadRateLimiter } from "@/lib/rag/rag-read-rate-limit";
import { getEffectiveRagTopK } from "@/lib/rag/effective-top-k";
import { queryRag } from "@/lib/rag/service";

export const runtime = "nodejs";

const querySchema = z.object({
  query: z.string().trim().min(1).max(RAG_MAX_QUERY_CHARS),
  namespace: z.string().trim().min(1).optional(),
  topK: z.number().int().min(1).max(20).optional(),
  filter: ragMetadataFilterSchema,
});

function jsonError(message: string, status: number, init?: ResponseInit) {
  return NextResponse.json({ success: false as const, error: message }, { status, ...init });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = ragReadRateLimiter.check(ip);
  if (!limited.ok) {
    return jsonError("Too many requests. Try again in a moment.", 429, {
      headers: { "retry-after": String(limited.retryAfterSec) },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = querySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body.", 400);
  }

  const effectiveTopK = getEffectiveRagTopK(parsed.data.topK);

  try {
    const matches = await queryRag(parsed.data);
    return NextResponse.json({
      success: true as const,
      result: {
        query: parsed.data.query,
        effectiveTopK,
        count: matches.length,
        matches,
      },
    });
  } catch (error) {
    console.error("rag/query failed", error);
    return jsonError("Failed to query knowledge base.", 500);
  }
}
