"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: 'movie' | 'article';
  title: string;
  year?: number;
  slug: string;
  overview?: string;
  excerpt?: string;
  rating?: number;
  kind?: string;
  url: string;
}

interface SearchResults {
  movies: SearchResult[];
  articles: SearchResult[];
  total: number;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ movies: [], articles: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults({ movies: [], articles: [], total: 0 });
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allResults = [...results.movies, ...results.articles];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < allResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allResults[selectedIndex]) {
        router.push(allResults[selectedIndex].url);
        setShowResults(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (url: string) => {
    router.push(url);
    setShowResults(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Search movies and articles..."
          className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E0B15C] focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E0B15C]"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (results.total > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A1220] border border-white/20 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E0B15C] mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.total === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {/* Movies Section */}
              {results.movies.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-[#E0B15C] uppercase tracking-wide">
                    Movies ({results.movies.length})
                  </div>
                  {results.movies.map((movie, index) => (
                    <button
                      key={movie.id}
                      onClick={() => handleResultClick(movie.url)}
                      className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                        selectedIndex === index ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#E0B15C]/20 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#E0B15C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">
                            {movie.title} {movie.year && `(${movie.year})`}
                          </div>
                          {movie.overview && (
                            <div className="text-sm text-gray-400 truncate">
                              {movie.overview}
                            </div>
                          )}
                        </div>
                        {movie.rating && (
                          <div className="flex-shrink-0 text-sm text-[#E0B15C]">
                            ⭐ {movie.rating}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Articles Section */}
              {results.articles.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-[#E0B15C] uppercase tracking-wide">
                    Articles ({results.articles.length})
                  </div>
                  {results.articles.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => handleResultClick(article.url)}
                      className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                        selectedIndex === results.movies.length + index ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-[#E0B15C]/20 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#E0B15C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">
                            {article.title}
                          </div>
                          {article.excerpt && (
                            <div className="text-sm text-gray-400 truncate">
                              {article.excerpt}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-xs text-gray-500">
                          {article.kind}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
