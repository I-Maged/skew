import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  // Defer hard failure to call time; keep module importable.
}

export function getOpenRouter() {
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }
  return createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    headers: {
      "HTTP-Referer": "https://biasly.local",
      "X-Title": "biasly",
    },
  });
}

export const ANALYSIS_MODEL_ID = "nvidia/nemotron-3.5-super-vl:free";
export const EMBEDDING_MODEL_ID = "text-embedding-3-small";

export function getAnalysisModel() {
  return getOpenRouter()(ANALYSIS_MODEL_ID);
}

export function getEmbeddingModel() {
  return getOpenRouter().embeddingModel(EMBEDDING_MODEL_ID);
}