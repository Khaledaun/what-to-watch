'use client'

import { useState, useEffect } from 'react'
import { Filters } from '@/components/Filters'
import ResultCard from '@/components/ResultCard'
import AnswerBox from '@/components/AnswerBox'
import FAQ from '@/components/FAQ'
import { FilterInput, Recommendation } from '@/lib/types'
import { Platform, PLATFORM_NAMES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

interface PlatformPageProps {
  platform: Platform
}

const FAQ_ITEMS: Record<Platform, Array<{ question: string; answer: string }>> = {
  'netflix': [
    {
      question: "How do you find Netflix recommendations?",
      answer: "We use TMDB data to identify content available on Netflix, focusing on trending and highly-rated movies and TV shows that are currently streaming."
    },
    {
      question: "Are Netflix recommendations up to date?",
      answer: "Yes! Our recommendations are updated in real-time using the latest data from TMDB, ensuring you see the most current Netflix content."
    }
  ],
  'prime': [
    {
      question: "How do you find Prime Video recommendations?",
      answer: "We use TMDB data to identify content available on Prime Video, focusing on trending and highly-rated movies and TV shows that are currently streaming."
    },
    {
      question: "Do you include Prime Video originals?",
      answer: "Yes! Our recommendations include Prime Video originals, licensed content, and movies available for rent or purchase on the platform."
    }
  ],
  'disney-plus': [
    {
      question: "How do you find Disney+ recommendations?",
      answer: "We use TMDB data to identify content available on Disney+, including Disney, Marvel, Star Wars, and National Geographic content."
    },
    {
      question: "Do you include family-friendly content?",
      answer: "Yes! Disney+ recommendations are naturally family-friendly, but you can also use our family audience filter for additional safety."
    }
  ],
  'hulu': [
    {
      question: "How do you find Hulu recommendations?",
      answer: "We use TMDB data to identify content available on Hulu, including Hulu originals, network shows, and movies."
    },
    {
      question: "Do you include Hulu's live TV content?",
      answer: "Our recommendations focus on on-demand content available on Hulu, including both ad-supported and ad-free tiers."
    }
  ],
  'max': [
    {
      question: "How do you find Max recommendations?",
      answer: "We use TMDB data to identify content available on Max (formerly HBO Max), including HBO originals, Warner Bros. content, and more."
    },
    {
      question: "Do you include HBO Max originals?",
      answer: "Yes! Our recommendations include HBO Max originals, HBO series, Warner Bros. movies, and other premium content on the platform."
    }
  ],
  'apple-tv-plus': [
    {
      question: "How do you find Apple TV+ recommendations?",
      answer: "We use TMDB data to identify content available on Apple TV+, focusing on Apple's original series and movies."
    },
    {
      question: "Do you include Apple TV+ originals?",
      answer: "Yes! Our recommendations focus on Apple TV+ originals, which are exclusively available on the platform."
    }
  ]
}

export function PlatformPage({ platform }: PlatformPageProps) {
  const [filters, setFilters] = useState<FilterInput>({
    countries: ['US'],
    platforms: [platform],
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
        platform: platform,
      })
    }
    
    const url = recommendation.availability.urls[platform]
    if (url) {
      window.open(url, '_blank')
    }
  }

  const handleTrailer = (recommendation: Recommendation) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'trailer_click', {
        content_id: recommendation.id,
        content_title: recommendation.title,
        platform: platform,
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
        platform: platform,
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
          What to Watch on {PLATFORM_NAMES[platform]}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find the best movies and TV shows available on {PLATFORM_NAMES[platform]} tonight.
        </p>
      </div>

      {/* Answer Box */}
      <AnswerBox 
        content={`Discover the best content available on ${PLATFORM_NAMES[platform]} tonight. Our recommendations are tailored to your mood, available time, and viewing preferences.`}
        className="max-w-4xl mx-auto"
      />

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
              <h2 className="text-2xl font-semibold">{PLATFORM_NAMES[platform]} Picks</h2>
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
                    recommendation={recommendation}
                    onPlayNow={handlePlayNow}
                    onTrailer={handleTrailer}
                    onHide={handleHide}
                    isHidden={hiddenItems.has(recommendation.id)}
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
                    recommendation={recommendation}
                    onPlayNow={handlePlayNow}
                    onTrailer={handleTrailer}
                    onHide={handleHide}
                    isHidden={hiddenItems.has(recommendation.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
        <FAQ items={FAQ_ITEMS[platform]} />
      </div>
    </div>
  )
}
