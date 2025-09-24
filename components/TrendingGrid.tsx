'use client'

import { useState, useEffect } from 'react'
import { MovieCard } from '@/components/MovieCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TrendingGridProps {
  limit?: number
  showHeader?: boolean
}

export function TrendingGrid({ limit = 10, showHeader = true }: TrendingGridProps) {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from API first
        const response = await fetch('/api/movies/trending?limit=' + limit)
        if (response.ok) {
          const data = await response.json()
          if (data.movies && data.movies.length > 0) {
            setMovies(data.movies)
            setLoading(false)
            return
          }
        }
        
        // If API fails or returns no data, use fallback
        console.log('API failed, using fallback data')
        setMovies(getFallbackMovies(limit))
      } catch (err) {
        console.error('Error fetching trending movies:', err)
        setError('Failed to load trending movies')
        // Use fallback data on error
        setMovies(getFallbackMovies(limit))
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [limit])

  // Helper function for fallback movies
  function getFallbackMovies(limit: number) {
    return [
        {
          id: '1',
          slug: 'oppenheimer-2023',
          title: 'Oppenheimer',
          year: 2023,
          runtime: 180,
          vote_average: 8.1,
          poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
          type: 'movie'
        },
        {
          id: '2',
          slug: 'barbie-2023',
          title: 'Barbie',
          year: 2023,
          runtime: 114,
          vote_average: 6.9,
          poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
          type: 'movie'
        },
        {
          id: '3',
          slug: 'spider-man-across-the-spider-verse-2023',
          title: 'Spider-Man: Across the Spider-Verse',
          year: 2023,
          runtime: 140,
          vote_average: 8.6,
          poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
          type: 'movie'
        },
        {
          id: '4',
          slug: 'the-bear-2022',
          title: 'The Bear',
          year: 2022,
          episode_count: 18,
          vote_average: 8.6,
          poster_path: '/y8Vj6QJ8V8V8V8V8V8V8V8V8V8V8V.jpg',
          type: 'tv'
        },
        {
          id: '5',
          slug: 'succession-2018',
          title: 'Succession',
          year: 2018,
          episode_count: 39,
          vote_average: 8.8,
          poster_path: '/y8Vj6QJ8V8V8V8V8V8V8V8V8V8V8V.jpg',
          type: 'tv'
        }
      ].slice(0, limit)
    }

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 md:space-y-8">
            {showHeader && (
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Trending now
                </h2>
                <p className="text-muted-foreground mt-2">
                  What everyone's watching right now
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {Array.from({ length: limit }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg"></div>
                  <div className="mt-2 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error && movies.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load trending movies at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 md:space-y-8">
          {showHeader && (
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Trending now
              </h2>
              <p className="text-muted-foreground mt-2">
                What everyone's watching right now
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {movies.map((movie, index) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                priority={index < 5} // Prioritize first 5 images
              />
            ))}
          </div>
          
          {movies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No trending movies available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
