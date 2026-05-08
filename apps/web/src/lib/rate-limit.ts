/**
 * Simple in-memory rate limiter for API routes.
 *
 * For production, replace with Redis-backed rate limiting
 * (e.g. @upstash/ratelimit) for multi-instance support.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}

export interface RateLimitConfig {
  /** Max requests per window. Default: 100 */
  limit?: number
  /** Window size in seconds. Default: 60 */
  windowSec?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(identifier: string, config: RateLimitConfig = {}): RateLimitResult {
  cleanup()

  const limit = config.limit ?? 100
  const windowMs = (config.windowSec ?? 60) * 1000
  const now = Date.now()

  const existing = store.get(identifier)

  if (!existing || existing.resetAt < now) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs }
    store.set(identifier, entry)
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt }
  }

  existing.count++

  if (existing.count > limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  }
}

/**
 * Extract a client IP from standard headers.
 * Works behind proxies (Vercel, Cloudflare, Nginx).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  )
}
