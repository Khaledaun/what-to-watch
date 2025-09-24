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

  // Helper function for fallback movies with working TMDB URLs
  function getFallbackMovies(limit: number) {
    return [
        {
          id: '1',
          slug: 'the-dark-knight-2008',
          title: 'The Dark Knight',
          year: 2008,
          runtime: 152,
          vote_average: 9.0,
          poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
          type: 'movie'
        },
        {
          id: '2',
          slug: 'avengers-endgame-2019',
          title: 'Avengers: Endgame',
          year: 2019,
          runtime: 181,
          vote_average: 8.4,
          poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
          type: 'movie'
        },
        {
          id: '3',
          slug: 'avengers-infinity-war-2018',
          title: 'Avengers: Infinity War',
          year: 2018,
          runtime: 149,
          vote_average: 8.4,
          poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
          type: 'movie'
        },
        {
          id: '4',
          slug: 'the-godfather-1972',
          title: 'The Godfather',
          year: 1972,
          runtime: 175,
          vote_average: 9.2,
          poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
          type: 'movie'
        },
        {
          id: '5',
          slug: 'the-lord-of-the-rings-the-fellowship-of-the-ring-2001',
          title: 'The Lord of the Rings: The Fellowship of the Ring',
          year: 2001,
          runtime: 178,
          vote_average: 8.8,
          poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
          type: 'movie'
        },
        {
          id: '6',
          slug: 'the-lord-of-the-rings-the-two-towers-2002',
          title: 'The Lord of the Rings: The Two Towers',
          year: 2002,
          runtime: 179,
          vote_average: 8.7,
          poster_path: '/5VTN0pR8gcqV3EPUHHfMGn5EF1B.jpg',
          type: 'movie'
        },
        {
          id: '7',
          slug: 'forrest-gump-1994',
          title: 'Forrest Gump',
          year: 1994,
          runtime: 142,
          vote_average: 8.8,
          poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
          type: 'movie'
        },
        {
          id: '8',
          slug: 'the-lord-of-the-rings-the-return-of-the-king-2003',
          title: 'The Lord of the Rings: The Return of the King',
          year: 2003,
          runtime: 201,
          vote_average: 8.9,
          poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
          type: 'movie'
        },
        {
          id: '9',
          slug: 'the-shawshank-redemption-1994',
          title: 'The Shawshank Redemption',
          year: 1994,
          runtime: 142,
          vote_average: 9.3,
          poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
          type: 'movie'
        },
        {
          id: '10',
          slug: 'fight-club-1999',
          title: 'Fight Club',
          year: 1999,
          runtime: 139,
          vote_average: 8.8,
          poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
          type: 'movie'
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
