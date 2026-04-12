/**
 * Maps provider (Google Gemini, etc.) failures to copy that does not blame the site.
 */

export const RAG_QUOTA_USER_MESSAGE =
  "The AI provider hit its usage limit (this is temporary). Please try again in a few minutes — nothing is wrong with this portfolio.";

/** When the stream ends with no text and we cannot classify the cause. */
export const RAG_EMPTY_REPLY_FALLBACK =
  "No answer came back this time. The AI service may be busy or over its limit — try again shortly.";

function stringifyErrorChain(error: unknown): string {
  if (error == null) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const fromCause =
      error.cause !== undefined ? stringifyErrorChain(error.cause) : "";
    return `${error.message} ${fromCause} ${error.name}`.trim();
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return stringifyErrorChain((error as { message?: unknown }).message);
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/** True when the error is likely Google quota / rate limit / billing cap. */
export function isLikelyProviderQuotaError(error: unknown): boolean {
  const s = stringifyErrorChain(error);
  if (!s) return false;
  const lower = s.toLowerCase();
  if (lower.includes("quota") && lower.includes("exceed")) return true;
  if (lower.includes("resource_exhausted")) return true;
  if (lower.includes("resource exhausted")) return true;
  if (lower.includes("rate limit") || lower.includes("ratelimit")) return true;
  if (lower.includes("too many requests")) return true;
  if (/\b429\b/.test(s)) return true;
  if (lower.includes("billing") && lower.includes("exceed")) return true;
  if (lower.includes("generativelanguage") && lower.includes("limit")) return true;
  if (lower.includes("free_tier") && lower.includes("quota")) return true;
  if (lower.includes("exceeded your current quota")) return true;
  return false;
}

export function userFacingMessageForRagFailure(error: unknown): string {
  if (isLikelyProviderQuotaError(error)) return RAG_QUOTA_USER_MESSAGE;
  return "Could not generate an answer right now. Please try again in a moment.";
}
