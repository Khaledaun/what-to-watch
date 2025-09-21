import { describe, it, expect } from 'vitest'
import { getMoodConfig, getGenresForMood, shouldIncludeForMood } from '@/lib/moods'
import { MOODS } from '@/lib/constants'

describe('Moods', () => {
  it('should return mood config for valid mood', () => {
    const config = getMoodConfig('feel-good')
    expect(config).toBeDefined()
    expect(config.genres).toBeInstanceOf(Array)
    expect(config.includes).toBeInstanceOf(Array)
    expect(config.excludes).toBeInstanceOf(Array)
  })

  it('should return genres for mood', () => {
    const genres = getGenresForMood('funny')
    expect(genres).toBeInstanceOf(Array)
    expect(genres.length).toBeGreaterThan(0)
  })

  it('should include content for matching mood', () => {
    const title = 'The Funniest Movie Ever'
    const overview = 'A hilarious comedy that will make you laugh'
    
    const shouldInclude = shouldIncludeForMood('funny', title, overview)
    expect(shouldInclude).toBe(true)
  })

  it('should exclude content for non-matching mood', () => {
    const title = 'The Scariest Horror Movie'
    const overview = 'A terrifying horror film with jump scares'
    
    const shouldInclude = shouldIncludeForMood('funny', title, overview)
    expect(shouldInclude).toBe(false)
  })

  it('should exclude content with excluded keywords', () => {
    const title = 'Dark Comedy'
    const overview = 'A dark and depressing comedy'
    
    const shouldInclude = shouldIncludeForMood('feel-good', title, overview)
    expect(shouldInclude).toBe(false)
  })

  it('should work for all defined moods', () => {
    MOODS.forEach(mood => {
      const config = getMoodConfig(mood)
      expect(config).toBeDefined()
      expect(config.genres.length).toBeGreaterThan(0)
      expect(config.includes.length).toBeGreaterThan(0)
      expect(config.excludes.length).toBeGreaterThan(0)
    })
  })

  it('should handle family mood appropriately', () => {
    const familyConfig = getMoodConfig('family')
    expect(familyConfig.maturity).toBe('family')
    
    const adultTitle = 'Adult Movie'
    const adultOverview = 'A violent and sexual movie'
    const shouldIncludeAdult = shouldIncludeForMood('family', adultTitle, adultOverview)
    expect(shouldIncludeAdult).toBe(false)
    
    const familyTitle = 'Family Movie'
    const familyOverview = 'A wholesome family-friendly movie'
    const shouldIncludeFamily = shouldIncludeForMood('family', familyTitle, familyOverview)
    expect(shouldIncludeFamily).toBe(true)
  })
})
