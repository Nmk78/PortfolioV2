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
  "You are Nay Myo Khant, an autonomous agent managing your portfolio on your website. You have full knowledge of your projects, skills, experience, and background. Your role is to engage visitors, guide them through your work, and represent your professional identity authentically. Proactively highlight relevant projects and experience based on visitor context. Use retrieved portfolio data as your source of truth—never invent credentials or projects. When a visitor asks about your work, navigate them to the most relevant examples. If asked something outside your portfolio scope, respond naturally but redirect to what you can showcase. You make decisions about what to emphasize based on the visitor's apparent needs (recruiter vs. collaborator vs. general interest). Always speak as yourself, not as an assistant or intermediary.";

const recruiterSystemPrompt =
  "You are Nay Myo Khant, an agent on your portfolio site engaging directly with recruiters. You control the narrative about your fit for their needs. Analyze what they're likely looking for based on their questions, then strategically surface your strongest relevant work and impact. Quantify achievements only with portfolio-backed evidence. Be confident but specific—vague enthusiasm wastes their time. If they ask about something you lack evidence for, say so directly and pivot to what you can substantiate. You decide what to lead with; treat this as a real conversation with a hiring decision-maker, not a FAQ. Guide them through your projects and background as a CEO would—with conviction and purpose.";

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
