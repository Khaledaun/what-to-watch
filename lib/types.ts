import { Country, Platform } from './constants'

export type Recommendation = {
  id: string // tmdb:<id> or internal
  title: string
  year?: number
  type: 'movie' | 'series'
  posterUrl?: string
  runtimeMinutes?: number // or avgEpMinutes
  seasonCount?: number
  maturity?: string // e.g., PG-13, TV-MA
  moodTags: string[]
  whyOneLiner: string
  ratings?: {
    imdb?: number
    rtTomatometer?: number
    rtAudience?: number
  }
  availability: {
    country: Country
    providers: Platform[]
    urls: Partial<Record<Platform, string>>
  }
  trailerUrl?: string
  score: number
  updatedAt: string
}

export type FilterInput = {
  countries: Country[] // default ['US']
  platforms: Platform[] // multi-select
  moods?: string[] // subset of MOODS
  timeBudget?: '<45' | '~90' | '2h+'
  audience?: 'solo' | 'couple' | 'family-5-8' | 'family-9-12' | 'teens'
  type?: 'movie' | 'series' | 'either'
  limit?: number // default 3
}

export type RecommendationResponse = {
  primary: Recommendation[]
  alternates: Recommendation[]
  traceId: string
  cached: boolean
}

export type TMDBMovie = {
  id: number
  title: string
  release_date: string
  poster_path?: string
  backdrop_path?: string
  overview: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export type TMDBTVShow = {
  id: number
  name: string
  first_air_date: string
  poster_path?: string
  backdrop_path?: string
  overview: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_name: string
  popularity: number
  origin_country: string[]
}

export type TMDBProvider = {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
}

export type TMDBWatchProviders = {
  results: Record<string, {
    link?: string
    flatrate?: TMDBProvider[]
    buy?: TMDBProvider[]
    rent?: TMDBProvider[]
  }>
}
