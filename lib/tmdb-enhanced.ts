// Enhanced TMDB API utilities

export interface TMDBConfig {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
  change_keys: string[]
}

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  original_title: string
  genre_ids: number[]
  video: boolean
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  original_name: string
  genre_ids: number[]
  origin_country: string[]
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Mock TMDB API client
export class TMDBClient {
  private apiKey: string
  private baseUrl = 'https://api.themoviedb.org/3'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getConfig(): Promise<TMDBConfig> {
    // Mock config response
    return {
      images: {
        base_url: 'https://image.tmdb.org/t/p/',
        secure_base_url: 'https://image.tmdb.org/t/p/',
        backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
        logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
        poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
        profile_sizes: ['w45', 'w185', 'h632', 'original'],
        still_sizes: ['w92', 'w185', 'w300', 'original']
      },
      change_keys: ['adult', 'air_date', 'also_known_as', 'alternative_titles']
    }
  }

  async getTrendingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    // Mock trending movies response
    return {
      page: 1,
      results: [
        {
          id: 1,
          title: 'The Dark Knight',
          overview: 'Batman faces the Joker in this epic superhero film.',
          poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
          release_date: '2008-07-18',
          vote_average: 9.0,
          vote_count: 25000,
          popularity: 1000,
          adult: false,
          original_language: 'en',
          original_title: 'The Dark Knight',
          genre_ids: [28, 80, 18],
          video: false
        }
      ],
      total_pages: 1,
      total_results: 1
    }
  }

  async getTrendingTVShows(): Promise<TMDBResponse<TMDBTVShow>> {
    // Mock trending TV shows response
    return {
      page: 1,
      results: [
        {
          id: 1,
          name: 'The Bear',
          overview: 'A young chef returns to Chicago to run his family\'s sandwich shop.',
          poster_path: '/y8V0Xq2ni6j4uzku60Lo7UpF5zK.jpg',
          backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
          first_air_date: '2022-06-23',
          vote_average: 8.6,
          vote_count: 1500,
          popularity: 800,
          adult: false,
          original_language: 'en',
          original_name: 'The Bear',
          genre_ids: [35, 18],
          origin_country: ['US']
        }
      ],
      total_pages: 1,
      total_results: 1
    }
  }

  async getMovieDetails(id: number): Promise<TMDBMovie> {
    // Mock movie details response
    return {
      id,
      title: 'The Dark Knight',
      overview: 'Batman faces the Joker in this epic superhero film.',
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
      release_date: '2008-07-18',
      vote_average: 9.0,
      vote_count: 25000,
      popularity: 1000,
      adult: false,
      original_language: 'en',
      original_title: 'The Dark Knight',
      genre_ids: [28, 80, 18],
      video: false
    }
  }

  async getTVShowDetails(id: number): Promise<TMDBTVShow> {
    // Mock TV show details response
    return {
      id,
      name: 'The Bear',
      overview: 'A young chef returns to Chicago to run his family\'s sandwich shop.',
      poster_path: '/y8V0Xq2ni6j4uzku60Lo7UpF5zK.jpg',
      backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
      first_air_date: '2022-06-23',
      vote_average: 8.6,
      vote_count: 1500,
      popularity: 800,
      adult: false,
      original_language: 'en',
      original_name: 'The Bear',
      genre_ids: [35, 18],
      origin_country: ['US']
    }
  }
}

// Utility functions
export function getPosterUrl(posterPath: string, size: string = 'w500'): string {
  if (!posterPath) return ''
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

export function getBackdropUrl(backdropPath: string, size: string = 'w1280'): string {
  if (!backdropPath) return ''
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`
}

export function formatReleaseDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatVoteAverage(voteAverage: number): string {
  return voteAverage.toFixed(1)
}

export function getGenreName(genreId: number): string {
  const genres: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  }
  return genres[genreId] || 'Unknown'
}

// Additional exports for compatibility
export async function getTrendingMovies(timeWindow?: string, page?: number, region?: string): Promise<TMDBResponse<TMDBMovie>> {
  const client = new TMDBClient(process.env.TMDB_API_KEY || '')
  return client.getTrendingMovies()
}

export async function getTopRatedMovies(page?: number, region?: string): Promise<TMDBResponse<TMDBMovie>> {
  // Mock implementation
  return {
    page: 1,
    results: [
      {
        id: 1,
        title: 'The Godfather',
        overview: 'The aging patriarch of an organized crime dynasty...',
        poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
        release_date: '1972-03-24',
        vote_average: 9.2,
        vote_count: 30000,
        popularity: 1200,
        adult: false,
        original_language: 'en',
        original_title: 'The Godfather',
        genre_ids: [80, 18],
        video: false
      }
    ],
    total_pages: 1,
    total_results: 1
  }
}

export async function getNowPlayingMovies(page?: number, region?: string): Promise<TMDBResponse<TMDBMovie>> {
  // Mock implementation
  return {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Oppenheimer',
        overview: 'The story of American scientist J. Robert Oppenheimer...',
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
        release_date: '2023-07-21',
        vote_average: 8.5,
        vote_count: 20000,
        popularity: 1500,
        adult: false,
        original_language: 'en',
        original_title: 'Oppenheimer',
        genre_ids: [18, 36],
        video: false
      }
    ],
    total_pages: 1,
    total_results: 1
  }
}

export async function getMovieDetails(id: number): Promise<TMDBMovie> {
  const client = new TMDBClient(process.env.TMDB_API_KEY || '')
  return client.getMovieDetails(id)
}

export function generateSlug(title: string, year?: number): string {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  if (year) {
    slug += `-${year}`
  }
  
  return slug
}