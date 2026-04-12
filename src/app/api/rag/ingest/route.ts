import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ingestDocumentsToRag } from "@/lib/rag/service";

export const runtime = "nodejs";

const ingestSchema = z.object({
  namespace: z.string().trim().min(1).optional(),
  chunkSize: z.number().int().min(200).max(8000).optional(),
  chunkOverlap: z.number().int().min(0).max(4000).optional(),
  documents: z
    .array(
      z.object({
        id: z.string().trim().min(1).optional(),
        text: z.string().trim().min(1),
        metadata: z
          .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
          .optional(),
      }),
    )
    .min(1),
});

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false as const, error: message }, { status });
}

function isAuthorizedIngest(request: NextRequest): boolean {
  const expected = process.env.RAG_INGEST_SECRET?.trim();
  if (!expected) return false;
  const header = request.headers.get("x-rag-ingest-secret")?.trim();
  if (header && header === expected) return true;
  const auth = request.headers.get("authorization")?.trim();
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    return token === expected;
  }
  return false;
}

export async function POST(request: NextRequest) {
  const secretConfigured = Boolean(process.env.RAG_INGEST_SECRET?.trim());
  if (!secretConfigured) {
    return jsonError("RAG ingest is not configured.", 503);
  }
  if (!isAuthorizedIngest(request)) {
    return jsonError("Unauthorized.", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = ingestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body.", 400);
  }

  try {
    const result = await ingestDocumentsToRag(parsed.data);
    return NextResponse.json({ success: true as const, result });
  } catch (error) {
    console.error("rag/ingest failed", error);
    return jsonError("Failed to ingest documents.", 500);
  }
}
