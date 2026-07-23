import { headers } from "next/headers";

/**
 * In-memory sliding-window rate limiter.
 *
 * KNOWN LIMITATION (documented deliberately, not hidden): this state
 * lives in a single server process's memory. It's correct for a
 * single long-running Node instance, but each instance keeps its own
 * counters — it will NOT enforce a shared limit across multiple
 * serverless/edge instances running concurrently. If this deploys
 * behind multiple instances, replace the `store` Map below with a
 * shared backend (e.g. Upstash Redis, Vercel KV) behind the same
 * `checkRateLimit()` signature — no caller needs to change.
 *
 * This is judged acceptable for the beta: it still stops a single
 * abusive client from hammering the guest booking endpoints, which is
 * the realistic threat model here (there's no payment or PII-scraping
 * surface to protect beyond that). Revisit if traffic patterns or
 * infrastructure change.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Opportunistic cleanup so one-off keys (e.g. per-phone-number entries
// that will never be seen again) don't accumulate in memory forever.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the caller may retry, if `allowed` is false. */
  retryAfterSeconds: number;
}

/**
 * Checks and records one attempt against a fixed-window rate limit for
 * `key`. Call this once per attempt, immediately before doing the
 * work it's meant to guard — a call always counts, whether or not it
 * turns out to be allowed.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupExpired(windowMs);

  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.max(0, Math.ceil((entry.windowStart + windowMs - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

/**
 * Best-effort client IP extraction from forwarded headers, for use as
 * a rate-limit key alongside (not instead of) more meaningful
 * application-level keys like a phone number. Falls back to
 * `"unknown"` when no proxy header is present (e.g. local dev) —
 * callers should not treat that as a strong identity signal, only as
 * one more bucket among many.
 */
export async function getRequestIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]!.trim();
  }
  return headersList.get("x-real-ip") ?? "unknown";
}
