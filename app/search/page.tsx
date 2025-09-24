import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchForm from '@/components/SearchForm'
import SearchResults from '@/components/SearchResults'

export const metadata: Metadata = {
  title: 'Search Movies & TV Shows - What to Watch',
  description: 'Search for movies and TV shows to find where to watch them. Get personalized recommendations based on your preferences.',
  keywords: 'search movies, search TV shows, find movies, movie search, TV show search, streaming search',
  openGraph: {
    title: 'Search Movies & TV Shows - What to Watch',
    description: 'Search for movies and TV shows to find where to watch them.',
    type: 'website',
  },
  alternates: {
    canonical: '/search',
  },
}

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    year?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, year } = searchParams

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Search Movies & TV Shows
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find your favorite movies and TV shows and discover where to watch them
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchForm initialQuery={q} initialType={type} initialYear={year} />
        </div>

        {/* Search Results */}
        {q && (
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Searching...</p>
            </div>
          }>
            <SearchResults query={q} type={type} year={year} />
          </Suspense>
        )}

        {/* Popular Searches */}
        {!q && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Popular Searches
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Action Movies 2024',
                'Netflix Originals',
                'Disney Movies',
                'Horror Movies',
                'Comedy TV Shows',
                'Sci-Fi Series',
                'Romance Movies',
                'Documentaries'
              ].map((term) => (
                <a
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg p-4 text-center text-white transition-colors"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}