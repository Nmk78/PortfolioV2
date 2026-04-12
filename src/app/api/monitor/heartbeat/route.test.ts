import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => ({
  NextRequest: class extends Request {},
  NextResponse: {
    json(payload: unknown, init?: ResponseInit) {
      return new Response(JSON.stringify(payload), {
        ...init,
        headers: {
          "content-type": "application/json",
          ...(init?.headers ?? {}),
        },
      });
    },
  },
}));

type HeartbeatHandler = (request: Request) => Promise<Response>;

let GET: HeartbeatHandler;

interface CreateRequestOptions {
  monitorSecret?: string;
  bearerToken?: string;
}

function createRequest(options: CreateRequestOptions = {}) {
  const headers = new Headers();
  if (options.monitorSecret) headers.set("x-monitor-secret", options.monitorSecret);
  if (options.bearerToken) headers.set("authorization", `Bearer ${options.bearerToken}`);

  return new Request("http://localhost/api/monitor/heartbeat", {
    method: "GET",
    headers,
  });
}

describe("GET /api/monitor/heartbeat", () => {
  const originalMonitorSecret = process.env.MONITOR_ALERT_SECRET;
  const originalHeartbeatEndpoints = process.env.HEARTBEAT_ENDPOINTS;
  const originalCronSecret = process.env.CRON_SECRET;

  beforeAll(async () => {
    const routeModule = await import("./route");
    GET = routeModule.GET as unknown as HeartbeatHandler;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    if (originalMonitorSecret === undefined) delete process.env.MONITOR_ALERT_SECRET;
    else process.env.MONITOR_ALERT_SECRET = originalMonitorSecret;

    if (originalHeartbeatEndpoints === undefined) delete process.env.HEARTBEAT_ENDPOINTS;
    else process.env.HEARTBEAT_ENDPOINTS = originalHeartbeatEndpoints;

    if (originalCronSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = originalCronSecret;

    process.env.MONITOR_ALERT_SECRET = "monitor-secret";
    process.env.HEARTBEAT_ENDPOINTS = "/api/rag/query";
  });

  it("returns 401 when secret header is missing", async () => {
    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ success: false, error: "Unauthorized." });
  });

  it("returns ok when all monitored endpoints are healthy", async () => {
    const mockedFetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/api/rag/query")) {
          expect(init?.method).toBe("POST");
          expect(init?.body).toBe(JSON.stringify({ query: "heartbeat" }));
          return new Response("ok", { status: 200 });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      },
    );

    const response = await GET(createRequest({ monitorSecret: "monitor-secret" }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true, checked: 1, failed: 0 });
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("sends telegram alert when a monitored endpoint fails", async () => {
    const mockedFetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/rag/query"))
          return new Response("bad", { status: 500 });
        if (url.endsWith("/api/contact/telegram"))
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        return new Response("not found", { status: 404 });
      },
    );

    const response = await GET(createRequest({ monitorSecret: "monitor-secret" }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true, checked: 1, failed: 1 });
    expect(mockedFetch).toHaveBeenCalledTimes(2);
    expect(mockedFetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost/api/contact/telegram",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("authorizes using CRON_SECRET bearer token", async () => {
    process.env.CRON_SECRET = "cron-secret";

    const mockedFetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/rag/query"))
          return new Response("ok", { status: 200 });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      },
    );

    const response = await GET(createRequest({ bearerToken: "cron-secret" }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true, checked: 1, failed: 0 });
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });
});
