import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/database'
import { generateMovieStructuredData } from '@/lib/seo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaPoster } from '@/components/ui/media-poster'
import { PlatformButtons } from '@/components/PlatformButtons'
import { TrailerBlock } from '@/components/TrailerBlock'
import { ShareStrip } from '@/components/ShareStrip'
import { MovieCard } from '@/components/MovieCard'
import { Clock, Star, Calendar, Users, Play, ExternalLink } from 'lucide-react'

interface MoviePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = params
  
  try {
    const client = db.ensureClient()
    if (!client) {
      return {
        title: 'Movie Not Found - What to Watch',
        description: 'The requested movie could not be found.'
      }
    }

    const { data: movie } = await client
      .from('titles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!movie) {
      return {
        title: 'Movie Not Found - What to Watch',
        description: 'The requested movie could not be found.'
      }
    }

    const year = new Date(movie.release_date || movie.first_air_date).getFullYear()
    const title = `${movie.title} (${year})`
    const description = movie.overview || `Watch ${movie.title} (${year}) - Find where to stream this ${movie.type === 'movie' ? 'movie' : 'TV show'} and get personalized recommendations.`

    return {
      title: `${title} - Where to Watch | What to Watch`,
      description: description,
      keywords: `${movie.title}, ${year}, ${movie.type === 'movie' ? 'movie' : 'TV show'}, streaming, where to watch, ${movie.original_language}, ${movie.genres?.join(', ')}`,
      openGraph: {
        title: `${title} - Where to Watch`,
        description: description,
        type: 'video.movie',
        images: [
          {
            url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
            width: 500,
            height: 750,
            alt: `${movie.title} poster`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - Where to Watch`,
        description: description,
        images: [movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg'],
      },
      alternates: {
        canonical: `/movie/${slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for movie:', error)
    return {
      title: 'Movie - What to Watch',
      description: 'Find where to watch your favorite movies and TV shows.'
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = params
  
  try {
    const client = db.ensureClient()
    if (!client) {
      notFound()
    }

    const { data: movie } = await client
      .from('titles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!movie) {
      notFound()
    }

    const year = new Date(movie.release_date || movie.first_air_date).getFullYear()
    const isMovie = movie.type === 'movie'
    const runtime = movie.runtime
    const episodeCount = movie.episode_count
    const seasonCount = movie.season_count

    // Get similar movies for recommendations
    let similarMovies: any[] = []
    try {
      const { data: similar } = await client
        .from('titles')
        .select('*')
        .neq('id', movie.id)
        .limit(6)
        .order('popularity', { ascending: false })
      similarMovies = similar || []
    } catch (error) {
      console.error('Error fetching similar movies:', error)
    }

    // Generate structured data
    const structuredData = generateMovieStructuredData({
      title: movie.title,
      year: year,
      type: isMovie ? 'movie' : 'series',
      overview: movie.overview || '',
      rating: movie.vote_average || 0,
      genres: movie.genres || [],
      runtime: runtime,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    })

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li>/</li>
                <li><Link href="/movies" className="hover:text-white">Movies</Link></li>
                <li>/</li>
                <li className="text-white">{movie.title}</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <MediaPoster
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
                  alt={`${movie.title} poster`}
                  title={movie.title}
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="shadow-2xl"
                />
              </div>

              {/* Movie Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {movie.title}
                    {movie.original_title && movie.original_title !== movie.title && (
                      <span className="text-2xl text-gray-300 ml-2">
                        ({movie.original_title})
                      </span>
                    )}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{year}</span>
                    </div>
                    
                    {isMovie && runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{runtime} min</span>
                      </div>
                    )}
                    
                    {!isMovie && episodeCount && (
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        <span>{episodeCount} episodes</span>
                      </div>
                    )}
                    
                    {!isMovie && seasonCount && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{seasonCount} seasons</span>
                      </div>
                    )}
                    
                    {movie.vote_average && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{movie.vote_average.toFixed(1)}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.genres.map((genre: string) => (
                        <Badge key={genre} variant="secondary" className="bg-purple-600 text-white">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overview */}
                {movie.overview && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Tagline */}
                {movie.tagline && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                      <p className="text-gray-300 italic text-center text-lg">"{movie.tagline}"</p>
                    </CardContent>
                  </Card>
                )}

                {/* Where to Watch */}
                <PlatformButtons 
                  platforms={['netflix', 'prime', 'disney', 'hulu', 'max']}
                  title={movie.title}
                  year={year}
                />
                
                {/* Trailer Block */}
                <TrailerBlock 
                  title={movie.title}
                  posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
                />
                
                {/* Share Strip */}
                <ShareStrip 
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://whattowatch.com'}/movie/${slug}`}
                  title={`Check out ${movie.title} (${year})`}
                  description={`I found this great ${isMovie ? 'movie' : 'TV show'} on What to Watch!`}
                />

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.original_language && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-4">
                        <h3 className="text-white font-semibold mb-2">Language</h3>
                        <p className="text-gray-300">{movie.original_language.toUpperCase()}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {movie.status && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-4">
                        <h3 className="text-white font-semibold mb-2">Status</h3>
                        <p className="text-gray-300 capitalize">{movie.status.replace('_', ' ')}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            {/* Similar Titles */}
            <div className="border-t my-8 md:my-10 pt-8">
              <div className="space-y-6 md:space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    You Might Also Like
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Similar {isMovie ? 'movies' : 'TV shows'} you might enjoy
                  </p>
                </div>
                
                {similarMovies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                    {similarMovies.map((similarMovie) => (
                      <MovieCard 
                        key={similarMovie.id} 
                        movie={similarMovie}
                        showWhereToWatch={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No similar titles available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching movie:', error)
    notFound()
  }
}

// Generate static params for popular movies
export async function generateStaticParams() {
  try {
    const client = db.ensureClient()
    if (!client) {
      return []
    }

    const { data: movies } = await client
      .from('titles')
      .select('slug')
      .order('popularity', { ascending: false })
      .limit(100) // Generate static pages for top 100 movies

    return movies?.map((movie: any) => ({
      slug: movie.slug,
    })) || []
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}