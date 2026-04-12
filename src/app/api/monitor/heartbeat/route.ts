import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_TIMEOUT_MS = 8_000;

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false as const, error: message }, { status });
}

function hasValidMonitorSecret(request: NextRequest): boolean {
  const expectedSecret = process.env.MONITOR_ALERT_SECRET?.trim();
  if (!expectedSecret) return false;

  const providedSecret = request.headers.get("x-monitor-secret")?.trim();
  if (!providedSecret) return false;

  return providedSecret === expectedSecret;
}

function hasValidCronSecret(request: NextRequest): boolean {
  const expectedCronSecret = process.env.CRON_SECRET?.trim();
  if (!expectedCronSecret) return false;

  const authorization = request.headers.get("authorization")?.trim();
  if (!authorization) return false;

  const [scheme, token] = authorization.split(/\s+/, 2);
  if (scheme?.toLowerCase() !== "bearer") return false;
  if (!token) return false;

  return token === expectedCronSecret;
}

function isAuthorized(request: NextRequest): boolean {
  if (hasValidCronSecret(request)) return true;
  return hasValidMonitorSecret(request);
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

function pathnameForProbe(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return "";
  }
}

/**
 * POST-only APIs (e.g. /api/rag/query) return 405 for GET — use method/body that matches the route.
 * /api/monitor/alert exposes GET for lightweight probes (no Telegram); POST still sends alerts.
 */
async function checkEndpoint(
  url: string,
  timeoutMs: number,
  monitorSecret: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const path = pathnameForProbe(url);
  const headers = new Headers({ "cache-control": "no-store" });

  let init: RequestInit = {
    method: "GET",
    cache: "no-store",
    signal: controller.signal,
    headers,
  };

  if (path === "/api/rag/query") {
    init = {
      ...init,
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ query: "heartbeat" }),
    };
  } else if (path === "/api/monitor/alert") {
    init = {
      ...init,
      method: "GET",
      headers: new Headers({ "x-monitor-secret": monitorSecret }),
    };
  }

  try {
    const response = await fetch(url, init);
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
    const result = await checkEndpoint(url, timeoutMs, monitorSecret);
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
