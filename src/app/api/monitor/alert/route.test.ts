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

let POST: (request: Request) => Promise<Response>;

function createRequest(body: unknown, secret = "") {
  const headers = new Headers({ "content-type": "application/json" });
  if (secret) headers.set("x-monitor-secret", secret);

  return new Request("http://localhost/api/monitor/alert", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/monitor/alert", () => {
  beforeAll(async () => {
    const routeModule = await import("./route");
    POST = routeModule.POST;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("MONITOR_ALERT_SECRET", "monitor-secret");
  });

  it("returns 401 when secret header is missing", async () => {
    const response = await POST(createRequest({ message: "test" }));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ success: false, error: "Unauthorized." });
  });

  it("returns 400 when message is empty", async () => {
    const response = await POST(createRequest({ message: "   " }, "monitor-secret"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ success: false, error: "Message is required." });
  });

  it("forwards alert to existing telegram endpoint", async () => {
    const mockedFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

    const response = await POST(
      createRequest({ message: "RAG query failed with 500" }, "monitor-secret"),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(
      "http://localhost/api/contact/telegram",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
