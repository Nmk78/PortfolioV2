import { Pinecone } from "@pinecone-database/pinecone";

import { ragConfig } from "@/lib/rag/config";

let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (pineconeClient) return pineconeClient;

  pineconeClient = new Pinecone({
    apiKey: ragConfig.pineconeApiKey(),
  });
  return pineconeClient;
}
