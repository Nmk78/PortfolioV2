import { embed, embedMany } from "ai";

import { chunkText } from "@/lib/rag/chunk";
import { getPineconeClient } from "@/lib/rag/clients";
import { ragConfig } from "@/lib/rag/config";
import { getEffectiveRagTopK } from "@/lib/rag/effective-top-k";
import { getEmbeddingModel } from "@/lib/rag/models";

type RagMetadataValue = string | number | boolean | null;
export type RagMetadata = Record<string, RagMetadataValue>;

export type RagDocumentInput = {
  id?: string;
  text: string;
  metadata?: RagMetadata;
};

export type RagQueryInput = {
  query: string;
  namespace?: string;
  topK?: number;
  filter?: RagMetadata;
};

export type RagQueryMatch = {
  id: string;
  score: number;
  text: string;
  metadata: RagMetadata;
};

function getTargetIndex(namespace?: string) {
  const pinecone = getPineconeClient();
  const index = pinecone.index(ragConfig.pineconeIndex());
  const namespaceToUse = namespace ?? ragConfig.defaultNamespace;
  return namespaceToUse ? index.namespace(namespaceToUse) : index;
}

function sanitizeVectorId(id: string): string {
  return id.replace(/[^a-zA-Z0-9:_-]/g, "-").slice(0, 512);
}

function createChunkId(documentId: string, chunkIndex: number): string {
  return sanitizeVectorId(`${documentId}::${chunkIndex}`);
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function ingestDocumentsToRag(params: {
  documents: RagDocumentInput[];
  namespace?: string;
  chunkSize?: number;
  chunkOverlap?: number;
}) {
  const embeddingModel = getEmbeddingModel();

  const preparedChunks: Array<{
    id: string;
    text: string;
    metadata: RagMetadata;
  }> = [];

  const chunkSize = params.chunkSize ?? ragConfig.chunkSize;
  const chunkOverlap = params.chunkOverlap ?? ragConfig.chunkOverlap;

  for (const [docIndex, document] of params.documents.entries()) {
    const cleanText = document.text.trim();
    if (!cleanText) continue;

    const baseDocumentId = document.id?.trim() || `doc-${Date.now()}-${docIndex}`;
    const chunks = chunkText(cleanText, { chunkSize, chunkOverlap });

    for (const [chunkIndex, chunk] of chunks.entries()) {
      preparedChunks.push({
        id: createChunkId(baseDocumentId, chunkIndex),
        text: chunk,
        metadata: {
          ...document.metadata,
          documentId: baseDocumentId,
          chunkIndex,
          textLength: chunk.length,
        },
      });
    }
  }

  if (preparedChunks.length === 0) {
    return {
      insertedChunks: 0,
      insertedDocuments: 0,
      namespace: params.namespace ?? ragConfig.defaultNamespace ?? null,
    };
  }

  const embeddingsResult = await embedMany({
    model: embeddingModel,
    values: preparedChunks.map((chunk) => chunk.text),
  });

  const vectors = preparedChunks.map((chunk, index) => ({
    id: chunk.id,
    values: embeddingsResult.embeddings[index],
    metadata: {
      ...chunk.metadata,
      text: chunk.text,
    },
  }));

  const targetIndex = getTargetIndex(params.namespace);
  await targetIndex.upsert({ records: vectors });

  return {
    insertedChunks: vectors.length,
    insertedDocuments: params.documents.length,
    namespace: params.namespace ?? ragConfig.defaultNamespace ?? null,
  };
}

async function queryRagOnce(params: RagQueryInput): Promise<RagQueryMatch[]> {
  const query = params.query.trim();
  if (!query) return [];

  const embeddingModel = getEmbeddingModel();

  const queryEmbedding = await embed({
    model: embeddingModel,
    value: query,
  });

  const targetIndex = getTargetIndex(params.namespace);
  const queryResult = await targetIndex.query({
    vector: queryEmbedding.embedding,
    topK: getEffectiveRagTopK(params.topK),
    includeMetadata: true,
    filter: params.filter,
  });

  return (queryResult.matches ?? []).map((match) => {
    const metadata = (match.metadata ?? {}) as RagMetadata;
    return {
      id: match.id,
      score: match.score ?? 0,
      text: toText(metadata.text),
      metadata,
    };
  });
}

/** Single-vector query for `/api/rag/query` and tooling. */
export async function queryRag(params: RagQueryInput): Promise<RagQueryMatch[]> {
  return queryRagOnce(params);
}

const EDUCATION_RETRIEVAL_RE =
  /\b(school|schools|university|college|uni\b|education|study|studying|studies|degree|major|minor|academic|gpa|semester|graduate|graduation|course|campus|polytechnic)\b/i;

/** README ingest/chat examples use `portfolio`; env may still say `default` or be unset. */
const PINECONE_FALLBACK_NAMESPACES = ["portfolio", "default"] as const;

function mergeMatchesByMaxScore(matches: RagQueryMatch[]): RagQueryMatch[] {
  const byId = new Map<string, RagQueryMatch>();
  for (const m of matches) {
    const prev = byId.get(m.id);
    if (!prev || m.score > prev.score) byId.set(m.id, m);
  }
  return [...byId.values()];
}

/**
 * When the API does not pass `namespace`, we use PINECONE_NAMESPACE. If that env
 * does not match where documents were ingested (e.g. data in `portfolio` but env
 * is `default`), Postman can still work because the body sets `"namespace": "portfolio"`.
 * The site chat omits namespace — try common namespaces after the env-based query.
 */
function namespaceAttemptsForChat(
  explicitFromRequest: string | undefined,
): (string | undefined)[] {
  const trimmed = explicitFromRequest?.trim();
  if (trimmed) return [trimmed];

  const seen = new Set<string>();
  const out: (string | undefined)[] = [];
  const add = (ns: string | undefined) => {
    const key = ns === undefined ? "__env_default__" : ns;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(ns);
  };

  add(undefined);
  for (const ns of PINECONE_FALLBACK_NAMESPACES) {
    if (ns !== ragConfig.defaultNamespace) add(ns);
  }
  return out;
}

/**
 * Chat retrieval: merge results across namespace attempts and education paraphrases.
 */
export async function queryRagForChat(
  params: RagQueryInput,
): Promise<RagQueryMatch[]> {
  const topK = getEffectiveRagTopK(params.topK);
  const namespaces = namespaceAttemptsForChat(params.namespace);
  const primary = params.query.trim();

  async function runQueries(queries: string[]): Promise<RagQueryMatch[]> {
    const merged: RagQueryMatch[] = [];
    for (const q of queries) {
      for (const ns of namespaces) {
        merged.push(
          ...(await queryRagOnce({ ...params, query: q, namespace: ns, topK })),
        );
      }
    }
    const deduped = mergeMatchesByMaxScore(merged);
    deduped.sort((a, b) => b.score - a.score);
    return deduped.slice(0, topK);
  }

  const first = await runQueries([primary]);
  if (first.length > 0) return first;

  if (!EDUCATION_RETRIEVAL_RE.test(params.query)) return first;

  return await runQueries([
    `${primary} education university academic background degree studies`,
    "education academic background university degree semester studies polytechnic",
  ]);
}
