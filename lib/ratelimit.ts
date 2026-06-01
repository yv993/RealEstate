// Simple in-memory per-IP fixed-window rate limiter.
// Note: state is per serverless instance (resets on cold start, not shared across
// regions). Good enough to blunt basic abuse; for strict limits use Upstash/Redis.

type Hit = { count: number; reset: number };
const store = new Map<string, Hit>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const hit = store.get(key);
  if (!hit || now > hit.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (hit.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.reset - now) / 1000) };
  }
  hit.count += 1;
  return { ok: true, remaining: limit - hit.count, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
