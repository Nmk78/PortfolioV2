import { embed, embedMany } from "ai";

import { chunkText } from "@/lib/rag/chunk";
import { getPineconeClient } from "@/lib/rag/clients";
import { ragConfig } from "@/lib/rag/config";
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
  filter?: Record<string, unknown>;
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

export async function queryRag(params: RagQueryInput): Promise<RagQueryMatch[]> {
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
    topK: params.topK ?? ragConfig.topK,
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
