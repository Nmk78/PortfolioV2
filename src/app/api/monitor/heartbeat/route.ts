import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_TIMEOUT_MS = 8_000;

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

function getMonitoredEndpoints(): string[] {
  const raw = process.env.HEARTBEAT_ENDPOINTS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((endpoint) => endpoint.trim())
    .filter(Boolean);
}

function getTimeoutMs(): number {
  const raw = Number(process.env.HEARTBEAT_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  if (!Number.isFinite(raw)) return DEFAULT_TIMEOUT_MS;
  return Math.min(Math.max(Math.floor(raw), 1_000), 30_000);
}

async function checkEndpoint(url: string, timeoutMs: number): Promise<{ ok: true } | { ok: false; reason: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown fetch error";
    return { ok: false, reason: message };
  } finally {
    clearTimeout(timeoutId);
  }
}

function toAbsoluteUrl(origin: string, endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  if (endpoint.startsWith("/")) return `${origin}${endpoint}`;
  return `${origin}/${endpoint}`;
}

export async function GET(request: NextRequest) {
  const monitorSecret = process.env.MONITOR_ALERT_SECRET?.trim();
  if (!monitorSecret || !isAuthorized(request)) return jsonError("Unauthorized.", 401);

  const configuredEndpoints = getMonitoredEndpoints();
  if (configuredEndpoints.length === 0) {
    return jsonError("No HEARTBEAT_ENDPOINTS configured.", 500);
  }

  const origin = new URL(request.url).origin;
  const timeoutMs = getTimeoutMs();

  const failures: string[] = [];
  for (const endpoint of configuredEndpoints) {
    const url = toAbsoluteUrl(origin, endpoint);
    const result = await checkEndpoint(url, timeoutMs);
    if (!result.ok) failures.push(`${endpoint} -> ${result.reason}`);
  }

  if (failures.length > 0) {
    let response: Response;
    try {
      response = await fetch(`${origin}/api/contact/telegram`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-monitor-secret": monitorSecret,
        },
        body: JSON.stringify({
          message: `Heartbeat failed (${failures.length}/${configuredEndpoints.length})\n\n${failures.join("\n")}`,
        }),
      });
    } catch {
      return jsonError("Failed to forward heartbeat alert.", 502);
    }

    if (!response.ok) {
      return jsonError("Failed to forward heartbeat alert.", 502);
    }
  }

  return NextResponse.json({
    success: true as const,
    checked: configuredEndpoints.length,
    failed: failures.length,
  });
}
