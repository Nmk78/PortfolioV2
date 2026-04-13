import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

import { ragConfig } from "@/lib/rag/config";

const openAiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY,
});

const groqProvider = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export function getEmbeddingModel() {
  if (ragConfig.embeddingProvider === "google") {
    ragConfig.googleApiKey();
    return googleProvider.embeddingModel(ragConfig.embeddingModel);
  }

  ragConfig.requireOpenAiApiKey();
  return openAiProvider.embeddingModel(ragConfig.embeddingModel);
}

export function getChatModel() {
  if (ragConfig.aiProvider === "google") {
    ragConfig.googleApiKey();
    return googleProvider.chat(ragConfig.chatModel);
  }

  if (ragConfig.aiProvider === "groq") {
    ragConfig.requireGroqApiKey();
    return groqProvider(ragConfig.chatModel);
  }

  ragConfig.requireOpenAiApiKey();
  return openAiProvider.chat(ragConfig.chatModel);
}
