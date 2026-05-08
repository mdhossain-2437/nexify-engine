import Redis from 'ioredis'

let client: Redis | null = null

function getRedisUrl(): string {
  return process.env.REDIS_URL || 'redis://localhost:6379'
}

export function getRedisClient(): Redis {
  if (!client) {
    client = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })

    client.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message)
    })
  }
  return client
}

export async function connectRedis(): Promise<boolean> {
  try {
    const redis = getRedisClient()
    await redis.connect()
    return true
  } catch {
    console.warn('[Redis] Could not connect, falling back to no-cache mode')
    return false
  }
}

export interface CacheOptions {
  /** TTL in seconds. Default 60. */
  ttl?: number
  /** Optional prefix for grouping. */
  prefix?: string
}

function buildKey(prefix: string | undefined, key: string): string {
  return prefix ? `${prefix}:${key}` : key
}

export async function cacheGet<T>(key: string, options?: CacheOptions): Promise<T | null> {
  try {
    const redis = getRedisClient()
    if (redis.status !== 'ready') return null
    const data = await redis.get(buildKey(options?.prefix, key))
    if (!data) return null
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  options?: CacheOptions,
): Promise<void> {
  try {
    const redis = getRedisClient()
    if (redis.status !== 'ready') return
    const ttl = options?.ttl ?? 60
    const fullKey = buildKey(options?.prefix, key)
    await redis.set(fullKey, JSON.stringify(value), 'EX', ttl)
  } catch {
    // Silently fail — cache is optional
  }
}

export async function cacheDel(key: string, options?: CacheOptions): Promise<void> {
  try {
    const redis = getRedisClient()
    if (redis.status !== 'ready') return
    await redis.del(buildKey(options?.prefix, key))
  } catch {
    // Silently fail
  }
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedisClient()
    if (redis.status !== 'ready') return
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch {
    // Silently fail
  }
}

/**
 * Cache-aside helper: fetch from cache, or execute `fn` and cache the result.
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  options?: CacheOptions,
): Promise<T> {
  const hit = await cacheGet<T>(key, options)
  if (hit !== null) return hit
  const result = await fn()
  await cacheSet(key, result, options)
  return result
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit()
    client = null
  }
}
