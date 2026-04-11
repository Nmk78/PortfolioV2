import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { queryRag } from "@/lib/rag/service";

export const runtime = "nodejs";

const querySchema = z.object({
  query: z.string().trim().min(1),
  namespace: z.string().trim().min(1).optional(),
  topK: z.number().int().min(1).max(50).optional(),
  filter: z.record(z.string(), z.unknown()).optional(),
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

  const parsed = querySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body.", 400);
  }

  try {
    const matches = await queryRag(parsed.data);
    return NextResponse.json({
      success: true as const,
      result: {
        query: parsed.data.query,
        count: matches.length,
        matches,
      },
    });
  } catch (error) {
    console.error("rag/query failed", error);
    return jsonError("Failed to query knowledge base.", 500);
  }
}
