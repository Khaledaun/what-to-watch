import { describe, it, expect } from 'vitest'

describe('API Endpoints', () => {
  const baseUrl = 'http://localhost:3000'

  it('should return recommendations for valid POST request', async () => {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countries: ['US'],
        platforms: ['netflix'],
        limit: 3,
      }),
    })

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('primary')
    expect(data).toHaveProperty('alternates')
    expect(data).toHaveProperty('traceId')
    expect(data).toHaveProperty('cached')
    
    expect(Array.isArray(data.primary)).toBe(true)
    expect(Array.isArray(data.alternates)).toBe(true)
    expect(data.primary.length).toBeLessThanOrEqual(3)
  })

  it('should return recommendations for valid GET request', async () => {
    const params = new URLSearchParams({
      countries: 'US',
      platforms: 'netflix,prime',
      limit: '3',
    })

    const response = await fetch(`${baseUrl}/api/recommend?${params}`)

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('primary')
    expect(data).toHaveProperty('alternates')
    expect(data).toHaveProperty('traceId')
  })

  it('should return 400 for invalid input', async () => {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms: [], // Invalid: empty platforms
      }),
    })

    expect(response.status).toBe(400)
    
    const data = await response.json()
    expect(data).toHaveProperty('error')
    expect(data).toHaveProperty('details')
  })

  it('should handle mood filters', async () => {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countries: ['US'],
        platforms: ['netflix'],
        moods: ['funny', 'feel-good'],
        limit: 3,
      }),
    })

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.primary.length).toBeGreaterThan(0)
  })

  it('should handle time budget filters', async () => {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countries: ['US'],
        platforms: ['netflix'],
        timeBudget: '~90',
        limit: 3,
      }),
    })

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.primary.length).toBeGreaterThan(0)
  })

  it('should handle audience filters', async () => {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countries: ['US'],
        platforms: ['netflix'],
        audience: 'family-5-8',
        limit: 3,
      }),
    })

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.primary.length).toBeGreaterThan(0)
  })

  it('should return trace ID for error tracking', async () => {
    const response = await fetch(`${baseUrl}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countries: ['US'],
        platforms: ['netflix'],
        limit: 3,
      }),
    })

    const data = await response.json()
    expect(data.traceId).toBeDefined()
    expect(typeof data.traceId).toBe('string')
    expect(data.traceId.length).toBeGreaterThan(0)
  })
})
