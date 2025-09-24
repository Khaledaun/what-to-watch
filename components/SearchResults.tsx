import { db } from '@/lib/database'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Calendar, Clock, Play } from 'lucide-react'

interface SearchResultsProps {
  query: string
  type?: string
  year?: string
}

export default async function SearchResults({ query, type, year }: SearchResultsProps) {
  try {
    const client = db.ensureClient()
    if (!client) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-300">Search temporarily unavailable. Please try again later.</p>
        </div>
      )
    }

    // Build search query
    let searchQuery = client
      .from('titles')
      .select('*')
      .or(`title.ilike.%${query}%,overview.ilike.%${query}%`)
      .order('popularity', { ascending: false })
      .limit(20)

    // Apply filters
    if (type) {
      searchQuery = searchQuery.eq('type', type)
    }

    if (year) {
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`
      searchQuery = searchQuery.or(`release_date.gte.${startDate},release_date.lte.${endDate},first_air_date.gte.${startDate},first_air_date.lte.${endDate}`)
    }

    const { data: results, error } = await searchQuery

    if (error) {
      console.error('Search error:', error)
      return (
        <div className="text-center py-12">
          <p className="text-gray-300">Search error. Please try again.</p>
        </div>
      )
    }

    if (!results || results.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-300 mb-4">
            We couldn't find any movies or TV shows matching "{query}"
          </p>
          <div className="text-sm text-gray-400">
            <p>Try:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Removing filters</li>
              <li>Searching for a more general term</li>
            </ul>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h2>
          <p className="text-gray-300">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
            {type && ` in ${type === 'movie' ? 'Movies' : 'TV Shows'}`}
            {year && ` from ${year}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item: any) => {
            const releaseYear = new Date(item.release_date || item.first_air_date).getFullYear()
            const isMovie = item.type === 'movie'
            
            return (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                <Link href={`/movie/${item.slug}`}>
                  <CardContent className="p-0">
                    <div className="relative aspect-[2/3] rounded-t-lg overflow-hidden">
                      <Image
                        src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.svg'}
                        alt={`${item.title} poster`}
                        fill
                        className="object-cover transition-transform duration-200 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{releaseYear}</span>
                        </div>
                        
                        {isMovie && item.runtime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.runtime}m</span>
                          </div>
                        )}
                        
                        {!isMovie && item.episode_count && (
                          <div className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            <span>{item.episode_count} eps</span>
                          </div>
                        )}
                        
                        {item.vote_average && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span>{item.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                          {isMovie ? 'Movie' : 'TV Show'}
                        </Badge>
                        
                        {item.genres && item.genres.length > 0 && (
                          <span className="text-xs text-gray-400 truncate ml-2">
                            {item.genres[0]}
                          </span>
                        )}
                      </div>
                      
                      {item.overview && (
                        <p className="text-xs text-gray-300 mt-2 line-clamp-2">
                          {item.overview}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* Load More Button */}
        {results.length === 20 && (
          <div className="text-center mt-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
              Load More Results
            </button>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Search results error:', error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-300">Search temporarily unavailable. Please try again later.</p>
      </div>
    )
  }
}
