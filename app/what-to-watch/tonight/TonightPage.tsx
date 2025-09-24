'use client'

import { useState, useEffect } from 'react'
import { Filters } from '@/components/Filters'
import ResultCard from '@/components/ResultCard'
import AnswerBox from '@/components/AnswerBox'
import FAQ from '@/components/FAQ'
import { FilterInput, Recommendation } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: "What makes a good 'tonight' recommendation?",
    answer: "Tonight recommendations are optimized for immediate viewing - they consider your available time, current mood, and what's trending right now on your streaming platforms."
  },
  {
    question: "How do you determine what's trending tonight?",
    answer: "We use real-time data from TMDB to identify the most popular and highly-rated content that's currently available on your selected streaming platforms."
  },
  {
    question: "Can I get recommendations for different time slots?",
    answer: "Yes! Use the time filters to get recommendations for quick 45-minute sessions, standard 90-minute movies, or longer 2+ hour viewing sessions."
  }
]

export function TonightPage() {
  const [filters, setFilters] = useState<FilterInput>({
    countries: ['US'],
    platforms: ['netflix', 'prime', 'hulu'],
    timeBudget: '~90',
    limit: 3,
  })
  const [recommendations, setRecommendations] = useState<{
    primary: Recommendation[]
    alternates: Recommendation[]
  }>({ primary: [], alternates: [] })
  const [loading, setLoading] = useState(false)
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async (filterInput: FilterInput) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterInput),
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      
      const data = await response.json()
      setRecommendations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: FilterInput) => {
    setFilters(newFilters)
    fetchRecommendations(newFilters)
  }

  const handlePlayNow = (recommendation: Recommendation) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'play_now_click', {
        content_id: recommendation.id,
        content_title: recommendation.title,
        content_type: recommendation.type,
      })
    }
    
    const firstProvider = recommendation.availability.providers[0]
    const url = recommendation.availability.urls[firstProvider]
    if (url) {
      window.open(url, '_blank')
    }
  }

  const handleTrailer = (recommendation: Recommendation) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'trailer_click', {
        content_id: recommendation.id,
        content_title: recommendation.title,
      })
    }
    
    if (recommendation.trailerUrl) {
      window.open(recommendation.trailerUrl, '_blank')
    }
  }

  const handleHide = (recommendation: Recommendation) => {
    setHiddenItems(prev => new Set([...prev, recommendation.id]))
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'hide_click', {
        content_id: recommendation.id,
        content_title: recommendation.title,
      })
    }
  }

  const handleRefresh = () => {
    fetchRecommendations(filters)
  }

  useEffect(() => {
    fetchRecommendations(filters)
  }, [])

  const visiblePrimary = recommendations.primary.filter(r => !hiddenItems.has(r.id))
  const visibleAlternates = recommendations.alternates.filter(r => !hiddenItems.has(r.id))

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          What to Watch Tonight
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Perfect picks for tonight's viewing session, optimized for your available time and mood.
        </p>
      </div>

      {/* Answer Box */}
      <div className="max-w-4xl mx-auto">
        <AnswerBox>
          Tonight's recommendations are carefully curated for immediate viewing, considering your streaming platforms, available time, and current mood preferences.
        </AnswerBox>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Filters onFiltersChange={handleFiltersChange} initialFilters={filters} />
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Tonight's Picks</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 border border-destructive rounded-lg">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {loading && recommendations.primary.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-lg" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visiblePrimary.map(recommendation => (
                  <ResultCard
                    key={recommendation.id}
                    item={recommendation}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Alternate Recommendations */}
          {visibleAlternates.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">More Like This</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleAlternates.map(recommendation => (
                  <ResultCard
                    key={recommendation.id}
                    item={recommendation}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
        <FAQ />
      </div>
    </div>
  )
}
