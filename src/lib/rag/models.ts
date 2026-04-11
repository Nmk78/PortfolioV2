import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

import { ragConfig } from "@/lib/rag/config";

const openAiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY,
});

export function getEmbeddingModel() {
  if (ragConfig.aiProvider === "google") {
    ragConfig.googleApiKey();
    return googleProvider.embeddingModel(ragConfig.embeddingModel);
  }

  ragConfig.openAiApiKey();
  return openAiProvider.embeddingModel(ragConfig.embeddingModel);
}

export function getChatModel() {
  if (ragConfig.aiProvider === "google") {
    ragConfig.googleApiKey();
    return googleProvider.chat(ragConfig.chatModel);
  }

  ragConfig.openAiApiKey();
  return openAiProvider.chat(ragConfig.chatModel);
}
