const DEFAULT_PRODUCTION_URL = "https://naymyokhant.dev";

function normalizeUrl(rawUrl?: string): string {
  if (!rawUrl) return DEFAULT_PRODUCTION_URL;
  const trimmed = rawUrl.trim();
  if (!trimmed) return DEFAULT_PRODUCTION_URL;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  return normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL ??
      process.env.VERCEL_URL
  );
}

export function getSiteOrigin(): URL {
  return new URL(getSiteUrl());
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteOrigin()).toString();
}
