import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export type RateLimiter = {
  check: (ip: string) => { ok: true } | { ok: false; retryAfterSec: number };
};

export function createRateLimiter(options: {
  max: number;
  windowMs: number;
  storeMaxKeys?: number;
}): RateLimiter {
  const { max, windowMs, storeMaxKeys = 5000 } = options;
  const buckets = new Map<string, number[]>();

  function prune(windowStart: number): void {
    if (buckets.size <= storeMaxKeys) return;
    for (const [key, stamps] of buckets) {
      const kept = stamps.filter((t) => t > windowStart);
      if (kept.length === 0) buckets.delete(key);
      else buckets.set(key, kept);
    }
  }

  return {
    check(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
      const now = Date.now();
      const windowStart = now - windowMs;
      prune(windowStart);

      let stamps = buckets.get(ip) ?? [];
      stamps = stamps.filter((t) => t > windowStart);

      if (stamps.length >= max) {
        const oldest = stamps[0]!;
        const retryAfterMs = Math.max(0, oldest + windowMs - now);
        return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
      }

      stamps.push(now);
      buckets.set(ip, stamps);
      return { ok: true };
    },
  };
}
