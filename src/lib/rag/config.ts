const DEFAULT_TOP_K = 6;
const DEFAULT_CHUNK_SIZE = 1200;
const DEFAULT_CHUNK_OVERLAP = 200;
const DEFAULT_OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_OPENAI_CHAT_MODEL = "gpt-4o-mini";
const DEFAULT_GOOGLE_EMBEDDING_MODEL = "gemini-embedding-2-preview";
const DEFAULT_GOOGLE_CHAT_MODEL = "gemini-2.5-flash";
const DEFAULT_GROQ_CHAT_MODEL = "llama-3.3-70b-versatile";

export type RagAiProvider = "openai" | "google" | "groq";

export type RagEmbeddingProvider = "openai" | "google";

function getAiProvider(): RagAiProvider {
  const raw = process.env.RAG_AI_PROVIDER?.trim().toLowerCase();
  if (raw === "google") return "google";
  if (raw === "openai") return "openai";
  return "groq";
}

function getEmbeddingProvider(): RagEmbeddingProvider {
  const raw = process.env.RAG_EMBEDDING_PROVIDER?.trim().toLowerCase();
  if (raw === "google") return "google";
  if (raw === "openai") return "openai";
  if (getAiProvider() === "google") return "google";
  return "openai";
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const ragConfig = {
  aiProvider: getAiProvider(),
  embeddingProvider: getEmbeddingProvider(),
  pineconeApiKey: () => getRequiredEnv("PINECONE_API_KEY"),
  pineconeIndex: () => getRequiredEnv("PINECONE_INDEX"),
  requireOpenAiApiKey: () => getRequiredEnv("OPENAI_API_KEY"),
  requireGroqApiKey: () => getRequiredEnv("GROQ_API_KEY"),
  googleApiKey: () =>
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ??
    process.env.GEMINI_API_KEY?.trim() ??
    getRequiredEnv("GOOGLE_GENERATIVE_AI_API_KEY"),
  embeddingModel:
    process.env.RAG_EMBEDDING_MODEL?.trim() ||
    (getEmbeddingProvider() === "google"
      ? process.env.GOOGLE_EMBEDDING_MODEL?.trim() || DEFAULT_GOOGLE_EMBEDDING_MODEL
      : process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_OPENAI_EMBEDDING_MODEL),
  chatModel:
    process.env.RAG_CHAT_MODEL?.trim() ||
    (getAiProvider() === "groq"
      ? process.env.GROQ_CHAT_MODEL?.trim() || DEFAULT_GROQ_CHAT_MODEL
      : getAiProvider() === "google"
        ? process.env.GOOGLE_CHAT_MODEL?.trim() || DEFAULT_GOOGLE_CHAT_MODEL
        : process.env.OPENAI_CHAT_MODEL?.trim() || DEFAULT_OPENAI_CHAT_MODEL),
  defaultNamespace: process.env.PINECONE_NAMESPACE?.trim() || undefined,
  topK: (() => {
    const n = Number(process.env.RAG_TOP_K ?? DEFAULT_TOP_K);
    if (!Number.isFinite(n) || n < 1) return DEFAULT_TOP_K;
    return Math.min(20, Math.floor(n));
  })(),
  chunkSize: Number(process.env.RAG_CHUNK_SIZE ?? DEFAULT_CHUNK_SIZE),
  chunkOverlap: Number(process.env.RAG_CHUNK_OVERLAP ?? DEFAULT_CHUNK_OVERLAP),
};
