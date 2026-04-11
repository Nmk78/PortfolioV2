import { NextRequest, NextResponse } from "next/server";

/** Telegram sendMessage text limit */
const TELEGRAM_MAX_TEXT = 4096;
const MAX_MESSAGE = 3500;
const MAX_NAME = 120;
const MAX_EMAIL = 254;

/** Max POSTs per client IP per rolling window */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_STORE_MAX_KEYS = 5000;

/** Telegram @username: 5–32 chars, [A-Za-z0-9_] */
const TELEGRAM_USERNAME_RE = /^[a-zA-Z0-9_]{5,32}$/;

/** Substring match (lowercase). Override or extend with CONTACT_BLOCKED_KEYWORDS (comma-separated). */
const DEFAULT_BLOCKED_KEYWORDS = [
  "viagra",
  "cialis",
  "casino",
  "lottery",
  "wire transfer",
  "western union",
  "seo service",
  "buy followers",
  "guaranteed ranking",
  "crypto investment",
  "forex signal",
  "act now limited",
] as const;

const rateLimitBuckets = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

function pruneRateLimitStore(windowStart: number): void {
  if (rateLimitBuckets.size <= RATE_LIMIT_STORE_MAX_KEYS) return;
  for (const [key, stamps] of rateLimitBuckets) {
    const kept = stamps.filter((t) => t > windowStart);
    if (kept.length === 0) rateLimitBuckets.delete(key);
    else rateLimitBuckets.set(key, kept);
  }
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  pruneRateLimitStore(windowStart);

  let stamps = rateLimitBuckets.get(ip) ?? [];
  stamps = stamps.filter((t) => t > windowStart);

  if (stamps.length >= RATE_LIMIT_MAX) {
    const oldest = stamps[0]!;
    const retryAfterMs = Math.max(0, oldest + RATE_LIMIT_WINDOW_MS - now);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  stamps.push(now);
  rateLimitBuckets.set(ip, stamps);
  return { ok: true };
}

function getBlockedKeywordFragments(): string[] {
  const extra = process.env.CONTACT_BLOCKED_KEYWORDS?.trim();
  const fromEnv = extra
    ? extra
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];
  const defaults = [...DEFAULT_BLOCKED_KEYWORDS].map((s) => s.toLowerCase());
  return fromEnv.length > 0 ? [...defaults, ...fromEnv] : defaults;
}

let blockedFragmentsCache: string[] | null = null;

function getFragmentsForMatching(): string[] {
  if (process.env.NODE_ENV === "development") {
    return getBlockedKeywordFragments();
  }
  if (!blockedFragmentsCache) {
    blockedFragmentsCache = getBlockedKeywordFragments();
  }
  return blockedFragmentsCache;
}

function textContainsBlockedKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  for (const frag of getFragmentsForMatching()) {
    if (frag.length > 0 && lower.includes(frag)) return true;
  }
  return false;
}

function normalizeTelegramUsername(raw: string): string {
  const s = raw.trim();
  return s.startsWith("@") ? s.slice(1) : s;
}

function isValidTelegramUsername(s: string): boolean {
  return TELEGRAM_USERNAME_RE.test(s);
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false as const, error: message }, { status });
}

/**
 * POST /api/contact/telegram
 * Relays a visitor message to your Telegram DM via Bot API.
 * The visitor does not use Telegram; only your bot token + chat id are used server-side.
 *
 * Body: { message: string, name?: string, email?: string, replyRequested?: boolean, telegramUsername?: string }
 *
 * Env (server only):
 * - TELEGRAM_BOT_TOKEN — from @BotFather
 * - TELEGRAM_CHAT_ID — your user id (send /start to the bot, then read chat id from getUpdates or @userinfobot)
 * - CONTACT_BLOCKED_KEYWORDS — optional comma-separated substrings to block (merged with built-in list)
 *
 * Limits: 5 requests per client IP per rolling 60s; keyword filter on message, name, email, Telegram username.
 */
function isDev() {
  return process.env.NODE_ENV === "development";
}

function isTrustedMonitorRequest(request: NextRequest): boolean {
  const expectedSecret = process.env.MONITOR_ALERT_SECRET?.trim();
  if (!expectedSecret) return false;

  const providedSecret = request.headers.get("x-monitor-secret")?.trim();
  if (!providedSecret) return false;

  return providedSecret === expectedSecret;
}

export async function POST(request: NextRequest) {
  const isMonitorCall = isTrustedMonitorRequest(request);
  if (!isMonitorCall) {
    const rate = checkRateLimit(getClientIp(request));
    if (!rate.ok) {
      return NextResponse.json(
        { success: false as const, error: "Too many messages. Please wait before trying again." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSec) },
        }
      );
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.error("contact/telegram: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return jsonError("Contact is not configured.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.", 400);
  }

  const o = body as Record<string, unknown>;
  const message = typeof o.message === "string" ? o.message.trim() : "";
  if (!message) {
    return jsonError("Message is required.", 400);
  }
  if (message.length > MAX_MESSAGE) {
    return jsonError(`Message must be at most ${MAX_MESSAGE} characters.`, 400);
  }

  const name =
    typeof o.name === "string" ? o.name.trim().slice(0, MAX_NAME) : "";
  const email =
    typeof o.email === "string" ? o.email.trim().slice(0, MAX_EMAIL) : "";

  const replyRequested = o.replyRequested === true;
  let telegramUsername = "";
  if (replyRequested) {
    const raw =
      typeof o.telegramUsername === "string" ? o.telegramUsername : "";
    telegramUsername = normalizeTelegramUsername(raw);
    if (!telegramUsername) {
      return jsonError(
        "Telegram username is required when Reply me is on.",
        400
      );
    }
    if (!isValidTelegramUsername(telegramUsername)) {
      return jsonError(
        "Invalid Telegram username (use 5–32 letters, numbers, underscores).",
        400
      );
    }
  }

  if (!isMonitorCall) {
    const fieldsToScan = [message, name, email, telegramUsername];
    for (const field of fieldsToScan) {
      if (field && textContainsBlockedKeyword(field)) {
        return jsonError("Message was rejected.", 400);
      }
    }
  }

  const parts: string[] = ["📩 New portfolio message", ""];
  if (name) parts.push(`Name: ${name}`);
  if (email) parts.push(`Email: ${email}`);
  if (replyRequested && telegramUsername) {
    parts.push(`Reply on Telegram: @${telegramUsername}`);
  }
  if (name || email || (replyRequested && telegramUsername)) parts.push("");
  parts.push(message);

  const text = parts.join("\n");
  if (text.length > TELEGRAM_MAX_TEXT) {
    return jsonError("Message too long.", 400);
  }

  const tgRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    }
  );

  let tgData: { ok?: boolean; description?: string; error_code?: number };
  try {
    tgData = (await tgRes.json()) as typeof tgData;
  } catch {
    console.error("contact/telegram: Telegram returned non-JSON", tgRes.status);
    return jsonError("Failed to deliver message.", 502);
  }

  if (!tgRes.ok || !tgData.ok) {
    const detail = tgData.description ?? tgRes.statusText;
    console.error("contact/telegram sendMessage failed:", {
      httpStatus: tgRes.status,
      error_code: tgData.error_code,
      description: detail,
    });
    const clientMsg = isDev()
      ? `Telegram: ${detail} (check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID; open your bot and send /start first)`
      : "Failed to deliver message.";
    return jsonError(clientMsg, 502);
  }

  return NextResponse.json({ success: true as const });
}
