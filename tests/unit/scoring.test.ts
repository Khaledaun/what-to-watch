import { describe, it, expect } from 'vitest'
import { score, sortByScore, filterByCriteria } from '@/lib/scoring'
import { Recommendation, FilterInput } from '@/lib/types'

const mockRecommendation: Recommendation = {
  id: 'test-1',
  title: 'Test Movie',
  year: 2023,
  type: 'movie',
  posterUrl: 'https://example.com/poster.jpg',
  runtimeMinutes: 90,
  maturity: 'PG-13',
  moodTags: ['feel-good', 'funny'],
  whyOneLiner: 'A great test movie',
  ratings: {
    imdb: 8.5,
  },
  availability: {
    country: 'US',
    providers: ['netflix', 'prime'],
    urls: {
      'netflix': 'https://netflix.com/test',
      'prime': 'https://prime.com/test',
    },
  },
  score: 0,
  updatedAt: '2023-01-01T00:00:00Z',
}

const mockFilterInput: FilterInput = {
  countries: ['US'],
  platforms: ['netflix'],
  moods: ['feel-good'],
  timeBudget: '~90',
  audience: 'solo',
  type: 'movie',
  limit: 3,
}

describe('Scoring', () => {
  it('should score recommendations correctly', () => {
    const scoreValue = score(mockRecommendation, mockFilterInput)
    expect(scoreValue).toBeGreaterThan(0)
    expect(scoreValue).toBeLessThanOrEqual(1)
  })

  it('should give higher scores to recent content', () => {
    const recentMovie = { ...mockRecommendation, year: 2023 }
    const oldMovie = { ...mockRecommendation, year: 2010 }
    
    const recentScore = score(recentMovie, mockFilterInput)
    const oldScore = score(oldMovie, mockFilterInput)
    
    expect(recentScore).toBeGreaterThan(oldScore)
  })

  it('should give higher scores to content with matching platforms', () => {
    const matchingPlatform = { ...mockRecommendation, availability: { ...mockRecommendation.availability, providers: ['netflix'] } }
    const nonMatchingPlatform = { ...mockRecommendation, availability: { ...mockRecommendation.availability, providers: ['hulu'] } }
    
    const matchingScore = score(matchingPlatform, mockFilterInput)
    const nonMatchingScore = score(nonMatchingPlatform, mockFilterInput)
    
    expect(matchingScore).toBeGreaterThan(nonMatchingScore)
  })

  it('should give higher scores to content with matching moods', () => {
    const matchingMood = { ...mockRecommendation, moodTags: ['feel-good'] }
    const nonMatchingMood = { ...mockRecommendation, moodTags: ['intense'] }
    
    const matchingScore = score(matchingMood, mockFilterInput)
    const nonMatchingScore = score(nonMatchingMood, mockFilterInput)
    
    expect(matchingScore).toBeGreaterThan(nonMatchingScore)
  })

  it('should sort recommendations by score', () => {
    const recommendations = [
      { ...mockRecommendation, id: '1', ratings: { imdb: 7 } },
      { ...mockRecommendation, id: '2', ratings: { imdb: 9 } },
      { ...mockRecommendation, id: '3', ratings: { imdb: 8 } },
    ]
    
    const sorted = sortByScore(recommendations, mockFilterInput)
    
    expect(sorted[0].id).toBe('2') // Highest rating
    expect(sorted[1].id).toBe('3')
    expect(sorted[2].id).toBe('1')
  })

  it('should filter recommendations by criteria', () => {
    const recommendations = [
      { ...mockRecommendation, id: '1', type: 'movie' as const },
      { ...mockRecommendation, id: '2', type: 'series' as const },
      { ...mockRecommendation, id: '3', type: 'movie' as const, runtimeMinutes: 45 },
    ]
    
    const filtered = filterByCriteria(recommendations, { ...mockFilterInput, type: 'movie' })
    
    expect(filtered).toHaveLength(2)
    expect(filtered.every(r => r.type === 'movie')).toBe(true)
  })

  it('should filter by runtime budget', () => {
    const recommendations = [
      { ...mockRecommendation, id: '1', runtimeMinutes: 30 },
      { ...mockRecommendation, id: '2', runtimeMinutes: 90 },
      { ...mockRecommendation, id: '3', runtimeMinutes: 150 },
    ]
    
    const filtered = filterByCriteria(recommendations, { ...mockFilterInput, timeBudget: '~90' })
    
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('2')
  })

  it('should filter by audience appropriateness', () => {
    const recommendations = [
      { ...mockRecommendation, id: '1', maturity: 'PG' },
      { ...mockRecommendation, id: '2', maturity: 'R' },
      { ...mockRecommendation, id: '3', maturity: 'PG-13' },
    ]
    
    const filtered = filterByCriteria(recommendations, { ...mockFilterInput, audience: 'family-5-8' })
    
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('1')
  })
})

