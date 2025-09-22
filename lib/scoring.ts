import { FilterInput, Recommendation } from './types'
import { yearsOld, overlap } from './utils'

export function score(item: Recommendation, f: FilterInput): number {
  // Recentness score (0-1, higher for newer content)
  const recentness = Math.max(0, 1 - (yearsOld(item.year?.toString()) / 5))
  
  // Rating score (0-1, based on IMDB rating)
  const rating = (item.ratings?.imdb ?? 7) / 10
  
  // Runtime fit score (0-1, based on time budget)
  let runtimeFit = 0.7 // default neutral score
  if (f.timeBudget === '~90') {
    if (item.runtimeMinutes) {
      runtimeFit = Math.abs(item.runtimeMinutes - 95) <= 20 ? 1 : 0.6
    } else {
      runtimeFit = 0.7
    }
  } else if (f.timeBudget === '<45') {
    // Prefer series for short time, movies are less ideal
    runtimeFit = item.type === 'series' ? 1 : 0.4
  } else if (f.timeBudget === '2h+') {
    // Prefer longer content
    runtimeFit = item.runtimeMinutes && item.runtimeMinutes > 120 ? 1 : 0.7
  }
  
  // Mood match score (0-1)
  const moodMatch = f.moods && f.moods.length
    ? overlap(item.moodTags, f.moods).length > 0 ? 1 : 0.5
    : 0.7 // neutral if no mood specified
  
  // Platform match score (0-1)
  const platformMatch = item.availability.providers.some(p => f.platforms.includes(p)) ? 1 : 0.2
  
  // Audience appropriateness score (0-1)
  let audienceScore = 1
  if (f.audience?.startsWith('family')) {
    // Family content should be appropriate
    if (item.maturity && ['R', 'NC-17', 'TV-MA'].includes(item.maturity)) {
      audienceScore = 0.1
    } else if (item.maturity && ['PG-13', 'TV-14'].includes(item.maturity)) {
      audienceScore = 0.6
    } else {
      audienceScore = 1
    }
  } else if (f.audience === 'teens') {
    // Teens can handle PG-13 but not R
    if (item.maturity && ['R', 'NC-17', 'TV-MA'].includes(item.maturity)) {
      audienceScore = 0.3
    } else {
      audienceScore = 1
    }
  }
  
  // Content type match score (0-1)
  const typeMatch = f.type === 'either' || f.type === item.type ? 1 : 0.1
  
  // Weighted combination
  const finalScore = 
    0.25 * recentness +
    0.25 * rating +
    0.15 * runtimeFit +
    0.10 * moodMatch +
    0.10 * platformMatch +
    0.10 * audienceScore +
    0.05 * typeMatch
  
  return Math.min(1, Math.max(0, finalScore))
}

export function sortByScore(items: Recommendation[], filterInput: FilterInput): Recommendation[] {
  return items
    .map(item => ({
      ...item,
      score: score(item, filterInput)
    }))
    .sort((a, b) => b.score - a.score)
}

export function filterByCriteria(items: Recommendation[], filterInput: FilterInput): Recommendation[] {
  return items.filter(item => {
    // Platform filter
    if (filterInput.platforms.length > 0) {
      const hasMatchingPlatform = item.availability.providers.some(p => 
        filterInput.platforms.includes(p)
      )
      if (!hasMatchingPlatform) return false
    }
    
    // Content type filter
    if (filterInput.type && filterInput.type !== 'either') {
      if (item.type !== filterInput.type) return false
    }
    
    // Runtime filter
    if (filterInput.timeBudget && item.runtimeMinutes) {
      if (filterInput.timeBudget === '<45' && item.runtimeMinutes > 45) return false
      if (filterInput.timeBudget === '~90' && (item.runtimeMinutes < 60 || item.runtimeMinutes > 120)) return false
      if (filterInput.timeBudget === '2h+' && item.runtimeMinutes < 120) return false
    }
    
    // Audience filter
    if (filterInput.audience?.startsWith('family')) {
      if (item.maturity && ['R', 'NC-17', 'TV-MA'].includes(item.maturity)) return false
    }
    
    // Mood filter
    if (filterInput.moods && filterInput.moods.length > 0) {
      const hasMatchingMood = overlap(item.moodTags, filterInput.moods).length > 0
      if (!hasMatchingMood) return false
    }
    
    return true
  })
}

export function generateWhyOneLiner(item: Recommendation, filterInput: FilterInput): string {
  const reasons: string[] = []
  
  // Rating reason
  if (item.ratings?.imdb && item.ratings.imdb >= 8) {
    reasons.push(`Highly rated (${item.ratings.imdb}/10)`)
  } else if (item.ratings?.imdb && item.ratings.imdb >= 7) {
    reasons.push(`Well-rated (${item.ratings.imdb}/10)`)
  }
  
  // Platform reason
  if (item.availability.providers.length > 0) {
    const platformNames = item.availability.providers.map(p => {
      const names: Record<string, string> = {
        'netflix': 'Netflix',
        'prime': 'Prime Video',
        'disney-plus': 'Disney+',
        'hulu': 'Hulu',
        'max': 'Max',
        'apple-tv-plus': 'Apple TV+',
      }
      return names[p] || p
    })
    reasons.push(`Available on ${platformNames.join(', ')}`)
  }
  
  // Runtime reason
  if (item.runtimeMinutes && filterInput.timeBudget) {
    if (filterInput.timeBudget === '~90' && Math.abs(item.runtimeMinutes - 90) <= 15) {
      reasons.push('Perfect length for tonight')
    } else if (filterInput.timeBudget === '<45' && item.type === 'series') {
      reasons.push('Quick episodes')
    }
  }
  
  // Mood reason
  if (item.moodTags.length > 0 && filterInput.moods) {
    const matchingMoods = overlap(item.moodTags, filterInput.moods)
    if (matchingMoods.length > 0) {
      reasons.push(`Great for ${matchingMoods[0]} mood`)
    }
  }
  
  // Recentness reason
  const age = yearsOld(item.year?.toString())
  if (age < 1) {
    reasons.push('Recently released')
  } else if (age < 3) {
    reasons.push('Recent release')
  }
  
  // Fallback reasons
  if (reasons.length === 0) {
    if (item.type === 'movie') {
      reasons.push('Popular movie')
    } else {
      reasons.push('Popular series')
    }
  }
  
  return reasons.slice(0, 2).join(' • ')
}

