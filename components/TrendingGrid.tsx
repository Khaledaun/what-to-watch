import { db } from '@/lib/database'
import { MovieCard } from '@/components/MovieCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TrendingGridProps {
  limit?: number
  showHeader?: boolean
}

export async function TrendingGrid({ limit = 10, showHeader = true }: TrendingGridProps) {
  let movies: any[] = []
  let error: string | null = null

  try {
    const client = db.ensureClient()
    if (client) {
      const { data, error: dbError } = await client
        .from('titles')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(limit)
      
      movies = data || []
      if (dbError) {
        error = 'Failed to load trending movies'
      }
    } else {
      // Fallback data when database is not available
      movies = [
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
  } catch (err) {
    error = 'Failed to load trending movies'
    console.error('TrendingGrid error:', err)
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
