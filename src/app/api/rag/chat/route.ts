import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { z } from "zod";

import { getClientIp } from "@/lib/api/rate-limit";
import {
  isLikelyProviderQuotaError,
  userFacingMessageForRagFailure,
} from "@/lib/rag/provider-errors";
import { RAG_MAX_QUERY_CHARS } from "@/lib/rag/limits";
import { ragMetadataFilterSchema } from "@/lib/rag/metadata-filter";
import { getChatModel } from "@/lib/rag/models";
import { ragReadRateLimiter } from "@/lib/rag/rag-read-rate-limit";
import { queryRagForChat } from "@/lib/rag/service";

export const runtime = "nodejs";

const chatSchema = z.object({
  question: z.string().trim().min(1).max(RAG_MAX_QUERY_CHARS),
  mode: z.enum(["assistant", "recruiter"]).optional(),
  namespace: z.string().trim().min(1).optional(),
  topK: z.number().int().min(1).max(20).optional(),
  temperature: z.number().min(0).max(2).optional(),
  filter: ragMetadataFilterSchema,
});

const defaultSystemPrompt =
  "You are Nay Myo Khant's portfolio assistant, embedded on Nay Myo Khant's website. Never present yourself as Google, OpenAI, Gemini, or any generic language model. If asked who you are, say you are Nay Myo Khant's portfolio assistant. Use retrieved context for portfolio-specific claims. If context is missing, you may still handle general conversation naturally, but do not invent portfolio facts. For portfolio-specific questions without evidence, clearly say what is missing and ask a concise follow-up.";
const recruiterSystemPrompt =
  "You are Nay Myo Khant's recruiter-facing portfolio assistant, embedded on Nay Myo Khant's website. Never claim to be Google, OpenAI, Gemini, or a generic language model. Write direct, confident, concise answers. Lead with strongest fit, quantify impact only when supported by context, and avoid filler. If evidence is limited, state exactly what is known and what is missing. If no retrieval context is available, provide a brief best-effort response and explicitly note that detailed portfolio evidence is unavailable.";

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    {
      success: false as const,
      error: message,
      ...(code ? { code } : {}),
    },
    { status },
  );
}

function formatContext(matches: Awaited<ReturnType<typeof queryRagForChat>>) {
  if (matches.length === 0) return "No matching context found.";

  return matches
    .map(
      (match, index) =>
        `Source ${index + 1} (score=${match.score.toFixed(4)}):\n${match.text}`,
    )
    .join("\n\n");
}

function truncateForLog(value: string, maxLength = 280) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = ragReadRateLimiter.check(ip);
  if (!limited.ok) {
    return NextResponse.json(
      {
        success: false as const,
        error: "Too many requests. Try again in a moment.",
        code: "rate_limited" as const,
      },
      {
        status: 429,
        headers: { "retry-after": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Invalid request body.",
      400,
    );
  }

  try {
    const matches = await queryRagForChat({
      query: parsed.data.question,
      namespace: parsed.data.namespace,
      topK: parsed.data.topK,
      filter: parsed.data.filter,
    });

    const context = formatContext(matches);
    const selectedSystemPrompt =
      parsed.data.mode === "recruiter" ? recruiterSystemPrompt : defaultSystemPrompt;

    if (process.env.NODE_ENV === "development") {
      console.info("rag/chat retrieved context", {
        questionPreview: truncateForLog(parsed.data.question),
        mode: parsed.data.mode ?? "assistant",
        sourcesCount: matches.length,
        sources: matches.map((match, index) => ({
          source: index + 1,
          score: Number(match.score.toFixed(4)),
          textPreview: truncateForLog(match.text),
        })),
      });
    }

    const prompt =
      matches.length > 0
        ? `Context:\n${context}\n\nQuestion:\n${parsed.data.question}`
        : `No retrieval context was found for this query.\n\nQuestion:\n${parsed.data.question}`;

    const result = streamText({
      model: getChatModel(),
      temperature: parsed.data.temperature ?? 0.2,
      system: selectedSystemPrompt,
      prompt,
    });

    return result.toTextStreamResponse({
      headers: {
        "x-rag-sources-count": String(matches.length),
      },
    });
  } catch (error) {
    console.error("rag/chat failed", error);
    const quota = isLikelyProviderQuotaError(error);
    return jsonError(
      userFacingMessageForRagFailure(error),
      quota ? 503 : 500,
      quota ? "provider_quota" : "rag_failed",
    );
  }
}
