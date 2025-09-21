import { Platform, Country } from './constants'
import { TMDBProvider } from './types'

// Static provider mapping - maps TMDB provider IDs to our platform slugs
const PROVIDER_MAPPING: Record<number, Platform> = {
  // Netflix
  8: 'netflix',
  
  // Prime Video
  9: 'prime',
  119: 'prime', // Amazon Prime Video
  
  // Disney+
  337: 'disney-plus',
  
  // Hulu
  15: 'hulu',
  
  // Max (HBO Max)
  384: 'max',
  31: 'max', // HBO Max
  
  // Apple TV+
  2: 'apple-tv-plus',
  350: 'apple-tv-plus',
}

// Platform-specific URLs (stub - would be replaced with JustWatch integration)
const PLATFORM_URLS: Record<Platform, Record<Country, string>> = {
  'netflix': {
    'US': 'https://www.netflix.com/title/',
    'CA': 'https://www.netflix.com/title/',
  },
  'prime': {
    'US': 'https://www.amazon.com/dp/',
    'CA': 'https://www.amazon.ca/dp/',
  },
  'disney-plus': {
    'US': 'https://www.disneyplus.com/movies/',
    'CA': 'https://www.disneyplus.com/movies/',
  },
  'hulu': {
    'US': 'https://www.hulu.com/movie/',
    'CA': 'https://www.hulu.com/movie/',
  },
  'max': {
    'US': 'https://play.max.com/movie/',
    'CA': 'https://play.max.com/movie/',
  },
  'apple-tv-plus': {
    'US': 'https://tv.apple.com/movie/',
    'CA': 'https://tv.apple.com/movie/',
  },
}

export function mapProvidersToPlatforms(tmdbProviders: TMDBProvider[], country: Country): Platform[] {
  const platforms: Platform[] = []
  
  for (const provider of tmdbProviders) {
    const platform = PROVIDER_MAPPING[provider.provider_id]
    if (platform && !platforms.includes(platform)) {
      platforms.push(platform)
    }
  }
  
  return platforms
}

export function resolveAvailability(
  tmdbProviders: TMDBProvider[],
  country: Country,
  tmdbId: number,
  type: 'movie' | 'tv'
): { providers: Platform[]; urls: Partial<Record<Platform, string>> } {
  const providers = mapProvidersToPlatforms(tmdbProviders, country)
  const urls: Partial<Record<Platform, string>> = {}
  
  for (const platform of providers) {
    const baseUrl = PLATFORM_URLS[platform]?.[country]
    if (baseUrl) {
      // This is a stub - in reality, we'd need the actual content ID from JustWatch
      urls[platform] = `${baseUrl}${tmdbId}`
    }
  }
  
  return { providers, urls }
}

// Mock data for development/testing
export const MOCK_AVAILABILITY: Record<number, { providers: Platform[]; urls: Partial<Record<Platform, string>> }> = {
  // Popular movies with mock availability
  550: { // Fight Club
    providers: ['netflix', 'prime'],
    urls: {
      'netflix': 'https://www.netflix.com/title/550',
      'prime': 'https://www.amazon.com/dp/550',
    },
  },
  13: { // Forrest Gump
    providers: ['netflix', 'max'],
    urls: {
      'netflix': 'https://www.netflix.com/title/13',
      'max': 'https://play.max.com/movie/13',
    },
  },
  238: { // The Godfather
    providers: ['prime', 'apple-tv-plus'],
    urls: {
      'prime': 'https://www.amazon.com/dp/238',
      'apple-tv-plus': 'https://tv.apple.com/movie/238',
    },
  },
  // Popular TV shows
  1399: { // Game of Thrones
    providers: ['max'],
    urls: {
      'max': 'https://play.max.com/tv/1399',
    },
  },
  1396: { // Breaking Bad
    providers: ['netflix'],
    urls: {
      'netflix': 'https://www.netflix.com/title/1396',
    },
  },
  1402: { // The Walking Dead
    providers: ['netflix', 'hulu'],
    urls: {
      'netflix': 'https://www.netflix.com/title/1402',
      'hulu': 'https://www.hulu.com/series/1402',
    },
  },
}

export function getMockAvailability(tmdbId: number): { providers: Platform[]; urls: Partial<Record<Platform, string>> } | null {
  return MOCK_AVAILABILITY[tmdbId] || null
}

// Interface for future JustWatch integration
export interface JustWatchClient {
  getAvailability(tmdbId: number, type: 'movie' | 'tv', country: Country): Promise<{
    providers: Platform[]
    urls: Partial<Record<Platform, string>>
  }>
}

// Stub implementation that can be replaced with real JustWatch client
export class StubJustWatchClient implements JustWatchClient {
  async getAvailability(tmdbId: number, type: 'movie' | 'tv', country: Country): Promise<{
    providers: Platform[]
    urls: Partial<Record<Platform, string>>
  }> {
    // Return mock data for now
    const mockData = getMockAvailability(tmdbId)
    if (mockData) {
      return mockData
    }
    
    // Fallback to random availability for testing
    const allPlatforms: Platform[] = ['netflix', 'prime', 'disney-plus', 'hulu', 'max', 'apple-tv-plus']
    const numProviders = Math.floor(Math.random() * 3) + 1
    const providers = allPlatforms.sort(() => 0.5 - Math.random()).slice(0, numProviders)
    
    const urls: Partial<Record<Platform, string>> = {}
    for (const platform of providers) {
      const baseUrl = PLATFORM_URLS[platform]?.[country]
      if (baseUrl) {
        urls[platform] = `${baseUrl}${tmdbId}`
      }
    }
    
    return { providers, urls }
  }
}
