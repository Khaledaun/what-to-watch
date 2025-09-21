export const SUPPORTED_COUNTRIES = ['US', 'CA'] as const
export const PLATFORMS = ['netflix', 'prime', 'disney-plus', 'hulu', 'max', 'apple-tv-plus'] as const
export const TIME_BUDGETS = ['<45', '~90', '2h+'] as const
export const AUDIENCES = ['solo', 'couple', 'family-5-8', 'family-9-12', 'teens'] as const
export const CONTENT_TYPES = ['movie', 'series', 'either'] as const
export const MOODS = ['feel-good', 'intense', 'funny', 'romantic', 'inspiring', 'family', 'spooky'] as const

export type Country = typeof SUPPORTED_COUNTRIES[number]
export type Platform = typeof PLATFORMS[number]
export type TimeBudget = typeof TIME_BUDGETS[number]
export type Audience = typeof AUDIENCES[number]
export type ContentType = typeof CONTENT_TYPES[number]
export type Mood = typeof MOODS[number]

export const PLATFORM_NAMES: Record<Platform, string> = {
  'netflix': 'Netflix',
  'prime': 'Prime Video',
  'disney-plus': 'Disney+',
  'hulu': 'Hulu',
  'max': 'Max',
  'apple-tv-plus': 'Apple TV+',
}

export const MOOD_NAMES: Record<Mood, string> = {
  'feel-good': 'Feel Good',
  'intense': 'Intense',
  'funny': 'Funny',
  'romantic': 'Romantic',
  'inspiring': 'Inspiring',
  'family': 'Family',
  'spooky': 'Spooky',
}

export const AUDIENCE_NAMES: Record<Audience, string> = {
  'solo': 'Solo',
  'couple': 'Couple',
  'family-5-8': 'Family (5-8)',
  'family-9-12': 'Family (9-12)',
  'teens': 'Teens',
}
