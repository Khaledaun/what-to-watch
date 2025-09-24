import ky from 'ky'
import { env } from './env'
import { z } from 'zod'

// TMDB API Configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'
const USER_AGENT = 'YallaCinema/1.0 (https://yallacinema.com)'

// Rate limiting and retry configuration
const RATE_LIMIT_DELAY = 250 // ms between requests
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // base delay in ms
const JITTER_FACTOR = 0.1 // 10% jitter

// Concurrency guard
let lastRequestTime = 0
const requestQueue: Array<() => Promise<any>> = []
let isProcessing = false

// TMDB API Response Schemas
const TMDBConfigSchema = z.object({
  images: z.object({
    base_url: z.string(),
    secure_base_url: z.string(),
    backdrop_sizes: z.array(z.string()),
    logo_sizes: z.array(z.string()),
    poster_sizes: z.array(z.string()),
    profile_sizes: z.array(z.string()),
    still_sizes: z.array(z.string()),
  }),
  change_keys: z.array(z.string()),
})

const TMDBGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const TMDBMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  release_date: z.string().optional(),
  poster_path: z.string().optional(),
  backdrop_path: z.string().optional(),
  overview: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  popularity: z.number(),
  video: z.boolean(),
})

const TMDBTVShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  first_air_date: z.string().optional(),
  poster_path: z.string().optional(),
  backdrop_path: z.string().optional(),
  overview: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  popularity: z.number(),
  origin_country: z.array(z.string()),
})

const TMDBWatchProviderSchema = z.object({
  display_priority: z.number(),
  logo_path: z.string(),
  provider_id: z.number(),
  provider_name: z.string(),
})

const TMDBWatchProvidersSchema = z.object({
  results: z.record(z.string(), z.object({
    link: z.string().optional(),
    flatrate: z.array(TMDBWatchProviderSchema).optional(),
    buy: z.array(TMDBWatchProviderSchema).optional(),
    rent: z.array(TMDBWatchProviderSchema).optional(),
  })),
})

// Types
export type TMDBConfig = z.infer<typeof TMDBConfigSchema>
export type TMDBGenre = z.infer<typeof TMDBGenreSchema>
export type TMDBMovie = z.infer<typeof TMDBMovieSchema>
export type TMDBTVShow = z.infer<typeof TMDBTVShowSchema>
export type TMDBWatchProvider = z.infer<typeof TMDBWatchProviderSchema>
export type TMDBWatchProviders = z.infer<typeof TMDBWatchProvidersSchema>

// Rate limiting helper
async function rateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest))
  }
  
  lastRequestTime = Date.now()
}

// Retry with exponential backoff and jitter
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error instanceof Error && 'status' in error) {
        const status = (error as any).status
        if (status >= 400 && status < 500 && status !== 429) {
          throw error
        }
      }
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff with jitter
      const delay = RETRY_DELAY * Math.pow(2, attempt)
      const jitter = delay * JITTER_FACTOR * Math.random()
      await new Promise(resolve => setTimeout(resolve, delay + jitter))
    }
  }
  
  throw lastError!
}

// Create TMDB client with rate limiting and retry
const tmdbClient = ky.create({
  prefixUrl: TMDB_BASE_URL,
  searchParams: {
    api_key: env.TMDB_API_KEY,
  },
  headers: {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json',
  },
  timeout: 30000,
  retry: {
    limit: 0, // We handle retries manually
  },
  hooks: {
    beforeRequest: [
      async () => {
        await rateLimit()
      },
    ],
  },
})

// Generic fetch function with retry
async function fetchTMDB<T>(endpoint: string, options?: any): Promise<T> {
  return withRetry(async () => {
    const response = await tmdbClient.get(endpoint, options)
    return response.json<T>()
  })
}

// TMDB API Functions
export async function getConfiguration(): Promise<TMDBConfig> {
  const response = await fetchTMDB<{ images: any; change_keys: string[] }>('configuration')
  return TMDBConfigSchema.parse(response)
}

export async function getGenres(type: 'movie' | 'tv'): Promise<TMDBGenre[]> {
  const response = await fetchTMDB<{ genres: any[] }>(`genre/${type}/list`)
  return response.genres.map(genre => TMDBGenreSchema.parse(genre))
}

export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1,
  region?: string
): Promise<{ results: TMDBMovie[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (region) searchParams.region = region
  
  const response = await fetchTMDB<{ results: any[]; total_pages: number; total_results: number }>(
    `trending/movie/${timeWindow}`,
    { searchParams }
  )
  
  return {
    ...response,
    results: response.results.map(movie => TMDBMovieSchema.parse(movie))
  }
}

export async function getTrendingTVShows(
  timeWindow: 'day' | 'week' = 'week',
  page: number = 1,
  region?: string
): Promise<{ results: TMDBTVShow[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (region) searchParams.region = region
  
  const response = await fetchTMDB<{ results: any[]; total_pages: number; total_results: number }>(
    `trending/tv/${timeWindow}`,
    { searchParams }
  )
  
  return {
    ...response,
    results: response.results.map(show => TMDBTVShowSchema.parse(show))
  }
}

export async function getTopRatedMovies(
  page: number = 1,
  region?: string
): Promise<{ results: TMDBMovie[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (region) searchParams.region = region
  
  const response = await fetchTMDB<{ results: any[]; total_pages: number; total_results: number }>(
    'movie/top_rated',
    { searchParams }
  )
  
  return {
    ...response,
    results: response.results.map(movie => TMDBMovieSchema.parse(movie))
  }
}

export async function getTopRatedTVShows(
  page: number = 1,
  region?: string
): Promise<{ results: TMDBTVShow[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (region) searchParams.region = region
  
  const response = await fetchTMDB<{ results: any[]; total_pages: number; total_results: number }>(
    'tv/top_rated',
    { searchParams }
  )
  
  return {
    ...response,
    results: response.results.map(show => TMDBTVShowSchema.parse(show))
  }
}

export async function getNowPlayingMovies(
  page: number = 1,
  region?: string
): Promise<{ results: TMDBMovie[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (region) searchParams.region = region
  
  const response = await fetchTMDB<{ results: any[]; total_pages: number; total_results: number }>(
    'movie/now_playing',
    { searchParams }
  )
  
  return {
    ...response,
    results: response.results.map(movie => TMDBMovieSchema.parse(movie))
  }
}

export async function getOnTheAirTVShows(
  page: number = 1,
  region?: string
): Promise<{ results: TMDBTVShow[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (region) searchParams.region = region
  
  const response = await fetchTMDB<{ results: any[]; total_pages: number; total_results: number }>(
    'tv/on_the_air',
    { searchParams }
  )
  
  return {
    ...response,
    results: response.results.map(show => TMDBTVShowSchema.parse(show))
  }
}

export async function getMovieDetails(
  movieId: number,
  appendToResponse?: string[]
): Promise<any> {
  const searchParams: any = {}
  if (appendToResponse) {
    searchParams.append_to_response = appendToResponse.join(',')
  }
  
  return fetchTMDB(`movie/${movieId}`, { searchParams })
}

export async function getTVShowDetails(
  tvId: number,
  appendToResponse?: string[]
): Promise<any> {
  const searchParams: any = {}
  if (appendToResponse) {
    searchParams.append_to_response = appendToResponse.join(',')
  }
  
  return fetchTMDB(`tv/${tvId}`, { searchParams })
}

export async function getWatchProviders(
  type: 'movie' | 'tv',
  id: number
): Promise<TMDBWatchProviders> {
  const response = await fetchTMDB<{ results: any }>(`${type}/${id}/watch/providers`)
  return TMDBWatchProvidersSchema.parse(response)
}

export async function getChanges(
  type: 'movie' | 'tv',
  startDate?: string,
  endDate?: string,
  page: number = 1
): Promise<{ results: any[]; total_pages: number; total_results: number }> {
  const searchParams: any = { page }
  if (startDate) searchParams.start_date = startDate
  if (endDate) searchParams.end_date = endDate
  
  return fetchTMDB(`${type}/changes`, { searchParams })
}

// Image URL builder
export function buildImageUrl(
  path: string | null | undefined,
  size: string = 'w500',
  baseUrl?: string
): string | null {
  if (!path) return null
  
  const base = baseUrl || TMDB_IMAGE_BASE
  return `${base}/${size}${path}`
}

// Poster URL builder
export function getPosterUrl(
  posterPath: string | null | undefined,
  size: string = 'w500'
): string | null {
  return buildImageUrl(posterPath, size)
}

// Backdrop URL builder
export function getBackdropUrl(
  backdropPath: string | null | undefined,
  size: string = 'w1280'
): string | null {
  return buildImageUrl(backdropPath, size)
}

// Logo URL builder
export function getLogoUrl(
  logoPath: string | null | undefined,
  size: string = 'w500'
): string | null {
  return buildImageUrl(logoPath, size)
}

// Profile URL builder
export function getProfileUrl(
  profilePath: string | null | undefined,
  size: string = 'w500'
): string | null {
  return buildImageUrl(profilePath, size)
}

// Trailer URL builder
export function getTrailerUrl(videos: any): string | null {
  if (!videos?.results) return null
  
  const trailer = videos.results.find((video: any) => 
    video.type === 'Trailer' && video.site === 'YouTube'
  )
  
  if (!trailer) return null
  
  return `https://www.youtube.com/watch?v=${trailer.key}`
}

// Runtime extractor
export function getRuntimeFromDetails(details: any): number | null {
  if (details.runtime) return details.runtime
  if (details.episode_run_time && details.episode_run_time.length > 0) {
    return details.episode_run_time[0]
  }
  return null
}

// Maturity rating extractor
export function getMaturityRating(details: any, country: string = 'US'): string | null {
  if (details.release_dates?.results) {
    const countryData = details.release_dates.results.find((r: any) => r.iso_3166_1 === country)
    if (countryData?.release_dates?.[0]?.certification) {
      return countryData.release_dates[0].certification
    }
  }
  
  if (details.content_ratings?.results) {
    const countryData = details.content_ratings.results.find((r: any) => r.iso_3166_1 === country)
    if (countryData?.rating) {
      return countryData.rating
    }
  }
  
  return null
}

// Slug generator
export function generateSlug(title: string, year?: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  return year ? `${baseSlug}-${year}` : baseSlug
}

// Export all functions
export {
  tmdbClient,
  fetchTMDB,
  withRetry,
  rateLimit,
}
