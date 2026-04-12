import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const alertSchema = z.object({
  message: z.string().trim().min(1).max(3500),
});

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false as const, error: message }, { status });
}

function isAuthorized(request: NextRequest): boolean {
  const expectedSecret = process.env.MONITOR_ALERT_SECRET?.trim();
  if (!expectedSecret) return false;

  const providedSecret = request.headers.get("x-monitor-secret")?.trim();
  if (!providedSecret) return false;

  return providedSecret === expectedSecret;
}

/** Lightweight probe for heartbeat/cron (no Telegram). POST still sends alerts. */
export async function GET(request: NextRequest) {
  const monitorSecret = process.env.MONITOR_ALERT_SECRET?.trim();
  if (!monitorSecret || !isAuthorized(request)) return jsonError("Unauthorized.", 401);

  return NextResponse.json({ success: true as const, probe: true as const });
}

export async function POST(request: NextRequest) {
  const monitorSecret = process.env.MONITOR_ALERT_SECRET?.trim();
  if (!monitorSecret || !isAuthorized(request)) return jsonError("Unauthorized.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    if (issue?.path[0] === "message" && issue.code === "too_small") {
      return jsonError("Message is required.", 400);
    }
    return jsonError(issue?.message ?? "Invalid request body.", 400);
  }

  const origin = new URL(request.url).origin;
  let response: Response;
  try {
    response = await fetch(`${origin}/api/contact/telegram`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-monitor-secret": monitorSecret,
      },
      body: JSON.stringify({
        message: `Endpoint monitor alert\n\n${parsed.data.message}`,
      }),
    });
  } catch {
    return jsonError("Failed to forward monitor alert.", 502);
  }

  if (!response.ok) {
    return jsonError("Failed to forward monitor alert.", 502);
  }

  return NextResponse.json({ success: true as const });
}
