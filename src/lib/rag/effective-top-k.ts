import { ragConfig } from "@/lib/rag/config";

export function getEffectiveRagTopK(raw?: number): number {
  const base = raw ?? ragConfig.topK;
  if (!Number.isFinite(base) || base < 1) return 6;
  return Math.min(20, Math.floor(base));
}
