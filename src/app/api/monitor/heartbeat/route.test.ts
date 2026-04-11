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

let GET: (request: Request) => Promise<Response>;

function createRequest(secret = "") {
  const headers = new Headers();
  if (secret) headers.set("x-monitor-secret", secret);

  return new Request("http://localhost/api/monitor/heartbeat", {
    method: "GET",
    headers,
  });
}

describe("GET /api/monitor/heartbeat", () => {
  beforeAll(async () => {
    const routeModule = await import("./route");
    GET = routeModule.GET;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("MONITOR_ALERT_SECRET", "monitor-secret");
    vi.stubEnv("HEARTBEAT_ENDPOINTS", "/api/rag/query");
  });

  it("returns 401 when secret header is missing", async () => {
    const response = await GET(createRequest());
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ success: false, error: "Unauthorized." });
  });

  it("returns ok when all monitored endpoints are healthy", async () => {
    const mockedFetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/rag/query"))
          return new Response("ok", { status: 200 });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      },
    );

    const response = await GET(createRequest("monitor-secret"));
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

    const response = await GET(createRequest("monitor-secret"));
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
});
