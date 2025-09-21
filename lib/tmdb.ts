import ky from 'ky'
import { env } from './env'
import { TMDBMovie, TMDBTVShow, TMDBWatchProviders } from './types'
import { Country } from './constants'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

const tmdbClient = ky.create({
  prefixUrl: TMDB_BASE_URL,
  searchParams: {
    api_key: env.TMDB_API_KEY,
  },
  timeout: 10000,
})

export async function getTrendingMovies(country: Country = 'US'): Promise<TMDBMovie[]> {
  try {
    const response = await tmdbClient.get('trending/movie/week', {
      searchParams: { region: country },
    }).json<{ results: TMDBMovie[] }>()
    
    return response.results || []
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return []
  }
}

export async function getTrendingTVShows(country: Country = 'US'): Promise<TMDBTVShow[]> {
  try {
    const response = await tmdbClient.get('trending/tv/week', {
      searchParams: { region: country },
    }).json<{ results: TMDBTVShow[] }>()
    
    return response.results || []
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    return []
  }
}

export async function getTopRatedMovies(country: Country = 'US'): Promise<TMDBMovie[]> {
  try {
    const response = await tmdbClient.get('movie/top_rated', {
      searchParams: { region: country },
    }).json<{ results: TMDBMovie[] }>()
    
    return response.results || []
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    return []
  }
}

export async function getTopRatedTVShows(country: Country = 'US'): Promise<TMDBTVShow[]> {
  try {
    const response = await tmdbClient.get('tv/top_rated', {
      searchParams: { region: country },
    }).json<{ results: TMDBTVShow[] }>()
    
    return response.results || []
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error)
    return []
  }
}

export async function getMovieDetails(tmdbId: number): Promise<any> {
  try {
    const response = await tmdbClient.get(`movie/${tmdbId}`, {
      searchParams: { append_to_response: 'videos,credits' },
    }).json()
    
    return response
  } catch (error) {
    console.error(`Error fetching movie details for ${tmdbId}:`, error)
    return null
  }
}

export async function getTVShowDetails(tmdbId: number): Promise<any> {
  try {
    const response = await tmdbClient.get(`tv/${tmdbId}`, {
      searchParams: { append_to_response: 'videos,credits' },
    }).json()
    
    return response
  } catch (error) {
    console.error(`Error fetching TV show details for ${tmdbId}:`, error)
    return null
  }
}

export async function getWatchProviders(tmdbId: number, type: 'movie' | 'tv', country: Country = 'US'): Promise<TMDBWatchProviders> {
  try {
    const response = await tmdbClient.get(`${type}/${tmdbId}/watch/providers`).json<TMDBWatchProviders>()
    return response
  } catch (error) {
    console.error(`Error fetching watch providers for ${type} ${tmdbId}:`, error)
    return { results: {} }
  }
}

export function getPosterUrl(posterPath?: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | undefined {
  if (!posterPath) return undefined
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`
}

export function getBackdropUrl(backdropPath?: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | undefined {
  if (!backdropPath) return undefined
  return `${TMDB_IMAGE_BASE}/${size}${backdropPath}`
}

export function getTrailerUrl(videos: any[]): string | undefined {
  if (!videos || videos.length === 0) return undefined
  
  const trailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.site === 'YouTube' && 
    video.official
  )
  
  if (trailer) {
    return `https://www.youtube.com/watch?v=${trailer.key}`
  }
  
  // Fallback to any YouTube trailer
  const youtubeTrailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.site === 'YouTube'
  )
  
  if (youtubeTrailer) {
    return `https://www.youtube.com/watch?v=${youtubeTrailer.key}`
  }
  
  return undefined
}

export function getRuntimeFromDetails(details: any, type: 'movie' | 'tv'): number | undefined {
  if (type === 'movie') {
    return details.runtime
  } else {
    // For TV shows, return average episode runtime
    return details.episode_run_time?.[0]
  }
}

export function getMaturityRating(details: any, type: 'movie' | 'tv'): string | undefined {
  if (type === 'movie') {
    return details.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US')?.release_dates?.[0]?.certification
  } else {
    return details.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'US')?.rating
  }
}
