// Naive per-IP sliding-window rate limiter, held in memory.
// Good enough to stop a single client hammering a public endpoint; it resets on
// every cold start and is per-instance, so it is NOT a security boundary.

type Bucket = number[]

const buckets = new Map<string, Map<string, Bucket>>()

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Records a hit for `key` in the `scope` window. Returns null when allowed, or
 * the number of seconds until the oldest hit expires when the limit is hit.
 */
export function rateLimit(scope: string, key: string, limit: number, windowMs: number): number | null {
  const now = Date.now()
  let scoped = buckets.get(scope)
  if (!scoped) {
    scoped = new Map()
    buckets.set(scope, scoped)
  }

  // Opportunistic cleanup so the map can't grow without bound.
  if (scoped.size > 5000) {
    for (const [k, hits] of scoped) {
      if (!hits.length || now - hits[hits.length - 1] > windowMs) scoped.delete(k)
    }
  }

  const hits = (scoped.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    scoped.set(key, hits)
    return Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000))
  }
  hits.push(now)
  scoped.set(key, hits)
  return null
}
