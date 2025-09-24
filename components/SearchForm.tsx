"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  tmdb_id: number;
  title: string;
  slug: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  type: string;
}

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for movies, TV shows, actors..."
            className="w-full px-6 py-4 pr-12 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Search Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-slate-300 mt-2">Searching...</p>
        </div>
      )}

      {hasSearched && !loading && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          {results.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Search Results ({results.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result) => (
                  <Link key={result.tmdb_id} href={`/movie/${result.slug}`} className="group">
                    <div className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-700/50 transition-all duration-200 transform hover:scale-105">
                      <div className="flex gap-4">
                        {result.poster_path && (
                          <div className="relative w-16 h-24 flex-shrink-0">
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                              alt={`${result.title} poster`}
                              fill
                              className="object-cover rounded"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                            {result.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-2">
                            {new Date(result.release_date).getFullYear()} • {result.vote_average ? result.vote_average.toFixed(1) : 'N/A'}/10
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            {result.type === 'movie' ? 'Movie' : 'TV Show'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-slate-300 mb-4">
                We couldn't find any movies or TV shows matching "{query}". Try a different search term.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setQuery('action')}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Action
                </button>
                <button
                  onClick={() => setQuery('comedy')}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Comedy
                </button>
                <button
                  onClick={() => setQuery('drama')}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Drama
                </button>
                <button
                  onClick={() => setQuery('horror')}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Horror
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popular Searches */}
      {!hasSearched && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Popular Searches</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'The Shawshank Redemption',
              'The Godfather',
              'Pulp Fiction',
              'The Dark Knight',
              'Forrest Gump',
              'Inception',
              'The Matrix',
              'Goodfellas'
            ].map((searchTerm) => (
              <button
                key={searchTerm}
                onClick={() => {
                  setQuery(searchTerm);
                  handleSearch(searchTerm);
                }}
                className="p-3 bg-slate-800/50 rounded-lg text-white hover:bg-slate-700/50 transition-colors text-left"
              >
                {searchTerm}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


