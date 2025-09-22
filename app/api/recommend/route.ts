import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { env, getDefaultCountries } from '@/lib/env'
import { FilterInput, Recommendation, RecommendationResponse } from '@/lib/types'
import { SUPPORTED_COUNTRIES, PLATFORMS, MOODS, TIME_BUDGETS, AUDIENCES, CONTENT_TYPES } from '@/lib/constants'
import { getCache, setCache, getRecommendationCacheKey } from '@/lib/cache'
import { generateTraceId, hashObject } from '@/lib/utils'
import { getTrendingMovies, getTrendingTVShows, getTopRatedMovies, getTopRatedTVShows, getMovieDetails, getTVShowDetails, getWatchProviders, getPosterUrl, getTrailerUrl, getRuntimeFromDetails, getMaturityRating } from '@/lib/tmdb'
import { resolveAvailability, StubJustWatchClient } from '@/lib/availability'
import { sortByScore, filterByCriteria, generateWhyOneLiner } from '@/lib/scoring'
import { getMoodConfig, shouldIncludeForMood } from '@/lib/moods'

// Validation schema for filter input
const filterInputSchema = z.object({
  countries: z.array(z.enum(SUPPORTED_COUNTRIES)).default(['US']),
  platforms: z.array(z.enum(PLATFORMS)).min(1, 'At least one platform must be selected'),
  moods: z.array(z.enum(MOODS)).optional(),
  timeBudget: z.enum(TIME_BUDGETS).optional(),
  audience: z.enum(AUDIENCES).optional(),
  type: z.enum(CONTENT_TYPES).default('either'),
  limit: z.number().min(1).max(10).default(3),
})

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const traceId = generateTraceId()
  
  try {
    const body = await request.json()
    const filterInput = filterInputSchema.parse(body) as FilterInput
    
    // Check cache first
    const cacheKey = getRecommendationCacheKey(filterInput)
    const cached = await getCache<RecommendationResponse>(cacheKey)
    
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        traceId,
      })
    }
    
    // Generate recommendations
    const recommendations = await generateRecommendations(filterInput, traceId)
    
    // Cache the results
    const response: RecommendationResponse = {
      ...recommendations,
      traceId,
      cached: false,
    }
    
    await setCache(cacheKey, response)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Recommendation API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: error.errors,
          traceId 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        traceId 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const traceId = generateTraceId()
  
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filterInput = filterInputSchema.parse({
      countries: searchParams.get('countries')?.split(',') || ['US'],
      platforms: searchParams.get('platforms')?.split(',') || ['netflix'],
      moods: searchParams.get('moods')?.split(','),
      timeBudget: searchParams.get('timeBudget') || undefined,
      audience: searchParams.get('audience') || undefined,
      type: searchParams.get('type') || 'either',
      limit: parseInt(searchParams.get('limit') || '3'),
    }) as FilterInput
    
    // Check cache first
    const cacheKey = getRecommendationCacheKey(filterInput)
    const cached = await getCache<RecommendationResponse>(cacheKey)
    
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        traceId,
      })
    }
    
    // Generate recommendations
    const recommendations = await generateRecommendations(filterInput, traceId)
    
    // Cache the results
    const response: RecommendationResponse = {
      ...recommendations,
      traceId,
      cached: false,
    }
    
    await setCache(cacheKey, response)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Recommendation API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: error.errors,
          traceId 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        traceId 
      },
      { status: 500 }
    )
  }
}

async function generateRecommendations(
  filterInput: FilterInput, 
  traceId: string
): Promise<{ primary: Recommendation[]; alternates: Recommendation[] }> {
  const justWatchClient = new StubJustWatchClient()
  const recommendations: Recommendation[] = []
  
  // Fetch trending and top-rated content
  const [trendingMovies, trendingTV, topRatedMovies, topRatedTV] = await Promise.all([
    getTrendingMovies(filterInput.countries[0]),
    getTrendingTVShows(filterInput.countries[0]),
    getTopRatedMovies(filterInput.countries[0]),
    getTopRatedTVShows(filterInput.countries[0]),
  ])
  
  // Combine and deduplicate
  const allContent = [
    ...trendingMovies.map(m => ({ ...m, type: 'movie' as const })),
    ...trendingTV.map(t => ({ ...t, type: 'tv' as const })),
    ...topRatedMovies.map(m => ({ ...m, type: 'movie' as const })),
    ...topRatedTV.map(t => ({ ...t, type: 'tv' as const })),
  ]
  
  // Remove duplicates by ID
  const uniqueContent = allContent.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id && t.type === item.type)
  )
  
  // Process each item
  for (const item of uniqueContent.slice(0, 50)) { // Limit to 50 for performance
    try {
      // Get detailed information
      const details = item.type === 'movie' 
        ? await getMovieDetails(item.id)
        : await getTVShowDetails(item.id)
      
      if (!details) continue
      
      // Get watch providers
      const watchProviders = await getWatchProviders(item.id, item.type, filterInput.countries[0])
      const availability = resolveAvailability(
        watchProviders.results[filterInput.countries[0]]?.flatrate || [],
        filterInput.countries[0],
        item.id,
        item.type
      )
      
      // Skip if not available on requested platforms
      if (filterInput.platforms.length > 0 && 
          !availability.providers.some(p => filterInput.platforms.includes(p))) {
        continue
      }
      
      // Generate mood tags
      const moodTags: string[] = []
      if (filterInput.moods) {
        for (const mood of filterInput.moods) {
          if (shouldIncludeForMood(mood, item.title || item.name, details.overview || '')) {
            moodTags.push(mood)
          }
        }
      }
      
      // Create recommendation object
      const recommendation: Recommendation = {
        id: `tmdb:${item.type}:${item.id}`,
        title: item.title || item.name,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        type: item.type,
        posterUrl: getPosterUrl(item.poster_path),
        runtimeMinutes: getRuntimeFromDetails(details, item.type),
        seasonCount: item.type === 'tv' ? details.number_of_seasons : undefined,
        maturity: getMaturityRating(details, item.type),
        moodTags,
        whyOneLiner: '', // Will be filled after scoring
        ratings: {
          imdb: item.vote_average > 0 ? item.vote_average : undefined,
        },
        availability: {
          country: filterInput.countries[0],
          providers: availability.providers,
          urls: availability.urls,
        },
        trailerUrl: getTrailerUrl(details.videos?.results || []),
        score: 0, // Will be calculated
        updatedAt: new Date().toISOString(),
      }
      
      recommendations.push(recommendation)
      
    } catch (error) {
      console.error(`Error processing ${item.type} ${item.id}:`, error)
      continue
    }
  }
  
  // Filter and score recommendations
  const filtered = filterByCriteria(recommendations, filterInput)
  const scored = sortByScore(filtered, filterInput)
  
  // Generate why one-liners
  scored.forEach(item => {
    item.whyOneLiner = generateWhyOneLiner(item, filterInput)
  })
  
  // Split into primary and alternates
  const primary = scored.slice(0, filterInput.limit || 3)
  const alternates = scored.slice(filterInput.limit || 3, (filterInput.limit || 3) + 3)
  
  return { primary, alternates }
}

