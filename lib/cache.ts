import { env } from './env'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

// In-memory cache fallback
const memoryCache = new Map<string, CacheEntry<any>>()

// KV client (will be initialized if REDIS_URL is provided)
let kvClient: any = null

// Initialize KV client if available
async function initKV() {
  if (kvClient || !env.REDIS_URL) return
  
  try {
    // Only use Vercel KV for Upstash Redis (Edge Runtime compatible)
    if (env.REDIS_URL.includes('upstash') || env.REDIS_URL.includes('vercel')) {
      const { kv } = await import('@vercel/kv')
      kvClient = kv
    } else {
      // For other Redis URLs, fall back to memory cache in Edge Runtime
      console.warn('Non-Upstash Redis URL detected, falling back to memory cache for Edge Runtime compatibility')
      kvClient = null
    }
  } catch (error) {
    console.warn('Failed to initialize KV client, falling back to memory cache:', error)
    kvClient = null
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  await initKV()
  
  try {
    if (kvClient) {
      const value = await kvClient.get(key)
      return value ? JSON.parse(value) : null
    } else {
      // Fallback to memory cache
      const entry = memoryCache.get(key)
      if (!entry) return null
      
      if (Date.now() > entry.expiresAt) {
        memoryCache.delete(key)
        return null
      }
      
      return entry.value
    }
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number = env.CACHE_TTL_SECONDS): Promise<void> {
  await initKV()
  
  try {
    if (kvClient) {
      await kvClient.setex(key, ttlSeconds, JSON.stringify(value))
    } else {
      // Fallback to memory cache
      const expiresAt = Date.now() + (ttlSeconds * 1000)
      memoryCache.set(key, { value, expiresAt })
      
      // Clean up expired entries periodically
      if (memoryCache.size > 1000) {
        const now = Date.now()
        for (const [k, v] of memoryCache.entries()) {
          if (now > v.expiresAt) {
            memoryCache.delete(k)
          }
        }
      }
    }
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  await initKV()
  
  try {
    if (kvClient) {
      await kvClient.del(key)
    } else {
      memoryCache.delete(key)
    }
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

export async function clearCache(): Promise<void> {
  await initKV()
  
  try {
    if (kvClient) {
      await kvClient.flushdb()
    } else {
      memoryCache.clear()
    }
  } catch (error) {
    console.error('Cache clear error:', error)
  }
}

// Cache key generators
export function getRecommendationCacheKey(filterInput: any): string {
  return `rec:${btoa(JSON.stringify(filterInput)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`
}

export function getTMDBDataCacheKey(endpoint: string, params: Record<string, any>): string {
  return `tmdb:${endpoint}:${btoa(JSON.stringify(params)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`
}

export function getAvailabilityCacheKey(tmdbId: number, type: 'movie' | 'tv', country: string): string {
  return `avail:${type}:${tmdbId}:${country}`
}

