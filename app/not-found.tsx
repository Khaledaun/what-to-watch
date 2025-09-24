import Link from "next/link";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { db } from "@/lib/database";

export const metadata: Metadata = {
  title: "Page Not Found | What to Watch Tonight",
  description: "The page you're looking for doesn't exist. Find great movie and TV recommendations instead. Browse our collection of movies, read reviews, and discover your next favorite film.",
  robots: "noindex, nofollow",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPopularMovies() {
  try {
    const { data: movies, error } = await db.ensureClient()
      .from('titles')
      .select('*')
      .eq('type', 'movie')
      .order('popularity', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }

    return movies || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

export default async function NotFound() {
  const popularMovies = await getPopularMovies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            404
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Page Not Found</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist. But don't worry - we have plenty of great
            movie and TV recommendations waiting for you! Discover amazing films, read reviews, and find your next favorite movie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Find What to Watch
            </Link>
            <Link
              href="/movies"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-200 transform hover:scale-105"
            >
              Browse Movies
            </Link>
            <Link
              href="/what-to-watch/tonight"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-200 transform hover:scale-105"
            >
              Tonight's Picks
            </Link>
          </div>

          {/* Popular Movies Section */}
          {popularMovies.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Popular Movies You Might Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularMovies.map((movie) => (
                  <Link key={movie.tmdb_id} href={`/movie/${movie.slug}`} className="group">
                    <div className="bg-slate-800/50 rounded-lg overflow-hidden hover:bg-slate-700/50 transition-all duration-200 transform hover:scale-105">
                      {movie.poster_path && (
                        <div className="relative aspect-[2/3]">
                          <img
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={`${movie.title} poster`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                          {movie.title}
                        </h3>
                        <p className="text-slate-400 text-xs">
                          {new Date(movie.release_date).getFullYear()} • {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular Pages */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Popular Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
              <Link href="/movies" className="text-slate-300 hover:text-white transition-colors p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                All Movies
              </Link>
              <Link href="/movies/popular" className="text-slate-300 hover:text-white transition-colors p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                Popular Movies
              </Link>
              <Link href="/movies/top-rated" className="text-slate-300 hover:text-white transition-colors p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                Top Rated
              </Link>
              <Link href="/what-to-watch/on-netflix" className="text-slate-300 hover:text-white transition-colors p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                Netflix Picks
              </Link>
              <Link href="/what-to-watch/on-prime" className="text-slate-300 hover:text-white transition-colors p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                Prime Video
              </Link>
              <Link href="/blog" className="text-slate-300 hover:text-white transition-colors p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50">
                Movie Blog
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-3">Can't Find What You're Looking For?</h3>
            <p className="text-slate-300 mb-4">
              Try searching for a specific movie title or browse our categories to discover new content.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Movies
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}