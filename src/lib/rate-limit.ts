import { headers } from "next/headers";

/**
 * Tiny in-memory sliding-window rate limiter.
 *
 *   const { ok, retryAfter } = await rateLimit("contact", { limit: 5, windowMs: 60_000 });
 *
 * Identifies callers by client IP (from x-forwarded-for if behind a
 * proxy, otherwise the request's remote address). Stores hit counts in
 * a per-bucket Map.
 *
 * Caveats:
 *   - Process-local. Multiple Vercel instances each get their own bucket,
 *     so a determined attacker could fan out across them. Good enough for
 *     this site's traffic; swap to Redis (e.g. @upstash/ratelimit) if/when
 *     scale demands it.
 *   - Memory grows linearly with unique clients. We sweep stale entries
 *     opportunistically on each check.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Map<string, Entry>>();

function getBucket(name: string): Map<string, Entry> {
  let b = buckets.get(name);
  if (!b) {
    b = new Map();
    buckets.set(name, b);
  }
  return b;
}

async function readClientIp(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return h.get("x-real-ip") ?? "unknown";
  } catch {
    return "unknown";
  }
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  key?: string; // override the IP-derived key
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export async function rateLimit(
  bucket: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const key = options.key ?? (await readClientIp());
  const map = getBucket(bucket);
  const now = Date.now();
  let entry = map.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + options.windowMs };
    map.set(key, entry);
  }
  entry.count += 1;

  // Opportunistic GC — drop expired buckets every so often.
  if (Math.random() < 0.05) {
    for (const [k, v] of map) {
      if (v.resetAt <= now) map.delete(k);
    }
  }

  const exceeded = entry.count > options.limit;
  return {
    ok: !exceeded,
    remaining: Math.max(0, options.limit - entry.count),
    retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
