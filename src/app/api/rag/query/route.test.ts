import { beforeEach, describe, expect, it, mock } from "bun:test";

const mockedQueryRag = mock(async () => []);

mock.module("next/server", () => ({
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

mock.module("@/lib/rag/service", () => ({
  queryRag: mockedQueryRag,
}));

function createRequest(body: string) {
  return new Request("http://localhost/api/rag/query", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  });
}

describe("POST /api/rag/query", () => {
  beforeEach(() => {
    mockedQueryRag.mockReset();
  });

  it("returns 400 when body is not valid JSON", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest("{"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      success: false,
      error: "Invalid JSON body.",
    });
  });

  it("returns 400 when required query is missing", async () => {
    const { POST } = await import("./route");
    const response = await POST(createRequest(JSON.stringify({ namespace: "portfolio" })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(typeof data.error).toBe("string");
  });

  it("returns matches from queryRag and includes count", async () => {
    const { POST } = await import("./route");
    mockedQueryRag.mockResolvedValue([
      {
        id: "doc-1::0",
        score: 0.98,
        text: "Ignite is a portfolio project.",
        metadata: { project: "ignite" },
      },
    ]);

    const response = await POST(
      createRequest(
        JSON.stringify({
          query: "  ignite summary  ",
          namespace: "portfolio",
          topK: 3,
          filter: { project: "ignite" },
        }),
      ),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockedQueryRag).toHaveBeenCalledWith({
      query: "ignite summary",
      namespace: "portfolio",
      topK: 3,
      filter: { project: "ignite" },
    });
    expect(data).toEqual({
      success: true,
      result: {
        query: "ignite summary",
        count: 1,
        matches: [
          {
            id: "doc-1::0",
            score: 0.98,
            text: "Ignite is a portfolio project.",
            metadata: { project: "ignite" },
          },
        ],
      },
    });
  });

  it("returns 500 when queryRag throws", async () => {
    const { POST } = await import("./route");
    mockedQueryRag.mockRejectedValue(new Error("pinecone unavailable"));

    const response = await POST(createRequest(JSON.stringify({ query: "test" })));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      success: false,
      error: "Failed to query knowledge base.",
    });
  });
});
