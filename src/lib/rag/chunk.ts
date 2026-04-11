export type ChunkConfig = {
  chunkSize: number;
  chunkOverlap: number;
};

function clampChunkConfig(config: ChunkConfig): ChunkConfig {
  const chunkSize = Number.isFinite(config.chunkSize) ? Math.max(200, Math.floor(config.chunkSize)) : 1200;
  const chunkOverlap = Number.isFinite(config.chunkOverlap)
    ? Math.max(0, Math.min(Math.floor(config.chunkOverlap), chunkSize - 1))
    : 200;

  return { chunkSize, chunkOverlap };
}

export function chunkText(text: string, config: ChunkConfig): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const { chunkSize, chunkOverlap } = clampChunkConfig(config);
  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < normalized.length) {
    const end = Math.min(cursor + chunkSize, normalized.length);
    const chunk = normalized.slice(cursor, end).trim();
    if (chunk) chunks.push(chunk);
    if (end === normalized.length) break;

    cursor += Math.max(1, chunkSize - chunkOverlap);
  }

  return chunks;
}
