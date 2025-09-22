import { Mood } from './constants'

export interface MoodConfig {
  genres: number[] // TMDB genre IDs
  includes: string[]
  excludes: string[]
  maturity: 'all' | 'family' | 'adult'
}

export const MOOD_CONFIGS: Record<Mood, MoodConfig> = {
  'feel-good': {
    genres: [35, 10751, 18], // Comedy, Family, Drama
    includes: ['uplifting', 'heartwarming', 'positive', 'inspiring'],
    excludes: ['dark', 'violent', 'depressing', 'horror'],
    maturity: 'all',
  },
  'intense': {
    genres: [28, 53, 80, 18], // Action, Thriller, Crime, Drama
    includes: ['thrilling', 'suspenseful', 'action-packed', 'gripping'],
    excludes: ['light', 'comedy', 'romantic'],
    maturity: 'adult',
  },
  'funny': {
    genres: [35, 16], // Comedy, Animation
    includes: ['hilarious', 'comedy', 'funny', 'humorous', 'laugh'],
    excludes: ['serious', 'dramatic', 'horror'],
    maturity: 'all',
  },
  'romantic': {
    genres: [10749, 18], // Romance, Drama
    includes: ['romance', 'love', 'romantic', 'relationship'],
    excludes: ['action', 'horror', 'violent'],
    maturity: 'all',
  },
  'inspiring': {
    genres: [18, 36, 99], // Drama, History, Documentary
    includes: ['inspiring', 'motivational', 'triumph', 'overcome', 'success'],
    excludes: ['depressing', 'dark', 'negative'],
    maturity: 'all',
  },
  'family': {
    genres: [10751, 16, 35], // Family, Animation, Comedy
    includes: ['family', 'kids', 'children', 'wholesome'],
    excludes: ['adult', 'violent', 'sexual', 'horror'],
    maturity: 'family',
  },
  'spooky': {
    genres: [27, 9648, 53], // Horror, Mystery, Thriller
    includes: ['scary', 'horror', 'spooky', 'frightening', 'supernatural'],
    excludes: ['comedy', 'romantic', 'family'],
    maturity: 'adult',
  },
}

export const TMDB_GENRES = {
  movie: {
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
    37: 'Western',
  },
  tv: {
    10759: 'Action & Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    10762: 'Kids',
    9648: 'Mystery',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics',
    37: 'Western',
  },
}

export function getMoodConfig(mood: Mood): MoodConfig {
  return MOOD_CONFIGS[mood]
}

export function getGenresForMood(mood: Mood): number[] {
  return MOOD_CONFIGS[mood].genres
}

export function shouldIncludeForMood(mood: Mood, title: string, overview: string): boolean {
  const config = MOOD_CONFIGS[mood]
  const text = `${title} ${overview}`.toLowerCase()
  
  // Check excludes first
  for (const exclude of config.excludes) {
    if (text.includes(exclude)) {
      return false
    }
  }
  
  // Check includes
  for (const include of config.includes) {
    if (text.includes(include)) {
      return true
    }
  }
  
  return false
}

