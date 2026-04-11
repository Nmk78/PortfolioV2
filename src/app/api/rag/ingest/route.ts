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
      })
    )
    .min(1),
});

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false as const, error: message }, { status });
}

export async function POST(request: NextRequest) {
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
