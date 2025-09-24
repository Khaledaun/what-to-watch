'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MediaPoster } from '@/components/ui/media-poster'
import { Star, Clock, Play } from 'lucide-react'

interface MovieCardProps {
  movie: {
    id: string
    slug: string
    title: string
    year?: number
    runtime?: number
    vote_average?: number
    poster_path?: string
    type?: 'movie' | 'tv'
    episode_count?: number
    season_count?: number
  }
  priority?: boolean
  showWhereToWatch?: boolean
}

export function MovieCard({ movie, priority = false, showWhereToWatch = true }: MovieCardProps) {
  const isMovie = movie.type === 'movie'
  const year = movie.year || new Date().getFullYear()
  
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-600'
    if (rating >= 7) return 'bg-yellow-600'
    if (rating >= 6) return 'bg-orange-600'
    return 'bg-red-600'
  }

  return (
    <article 
      itemScope 
      itemType="https://schema.org/Movie"
      className="group"
    >
      <Link href={`/movie/${movie.slug}`}>
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card/50 backdrop-blur">
          <CardContent className="p-0">
            {/* Poster */}
            <div className="relative">
              <MediaPoster
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
                alt={`${movie.title} poster`}
                title={movie.title}
                priority={priority}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="w-full"
              />
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                  {movie.poster_path ? `TMDB: ${movie.poster_path}` : 'No poster'}
                </div>
              )}
              
              {/* Rating Badge */}
              {movie.vote_average && movie.vote_average > 0 && (
                <Badge 
                  className={`absolute top-2 right-2 ${getRatingColor(movie.vote_average)} text-white border-0`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
              )}
              
              {/* Hover Overlay */}
              {showWhereToWatch && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    size="sm" 
                    className="bg-white text-black hover:bg-white/90"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Where to watch
                  </Button>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-2">
              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              
              {/* Meta Row */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{year}</span>
                  
                  {isMovie && movie.runtime && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{movie.runtime}m</span>
                      </div>
                    </>
                  )}
                  
                  {!isMovie && movie.episode_count && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        <span>{movie.episode_count} eps</span>
                      </div>
                    </>
                  )}
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  {isMovie ? 'Movie' : 'TV Show'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
