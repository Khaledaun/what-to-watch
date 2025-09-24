import Link from "next/link";
import Search from "./Search";

export default function Navigation() {
  return (
    <nav className="bg-[#0A1220]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-2xl font-bold text-[#E0B15C]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            What to Watch Tonight
          </Link>
          
                  <div className="hidden md:flex items-center gap-6">
                    <Search />
                    <Link 
                      href="/what-to-watch/tonight" 
                      className="text-gray-300 hover:text-[#E0B15C] transition-colors text-sm font-medium"
                      title="Find movies to watch tonight"
                    >
                      Tonight
                    </Link>
                    <Link 
                      href="/movies" 
                      className="text-gray-300 hover:text-[#E0B15C] transition-colors text-sm font-medium"
                      title="Browse all movies"
                    >
                      Movies
                    </Link>
                    <Link 
                      href="/movies/trending" 
                      className="text-gray-300 hover:text-[#E0B15C] transition-colors text-sm font-medium"
                      title="Trending movies this week"
                    >
                      Trending
                    </Link>
                    <Link 
                      href="/blog" 
                      className="text-gray-300 hover:text-[#E0B15C] transition-colors text-sm font-medium"
                      title="Movie guides and reviews"
                    >
                      Blog
                    </Link>
                  </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-[#E0B15C] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E0B15C] p-2"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#0A1220]/95 border-t border-white/10">
          <div className="px-3 py-2">
            <Search />
          </div>
                  <Link 
                    href="/what-to-watch/tonight" 
                    className="text-gray-300 hover:text-[#E0B15C] block px-3 py-2 text-base font-medium transition-colors"
                    title="Find movies to watch tonight"
                  >
                    Tonight
                  </Link>
                  <Link 
                    href="/movies" 
                    className="text-gray-300 hover:text-[#E0B15C] block px-3 py-2 text-base font-medium transition-colors"
                    title="Browse all movies"
                  >
                    Movies
                  </Link>
                  <Link 
                    href="/movies/trending" 
                    className="text-gray-300 hover:text-[#E0B15C] block px-3 py-2 text-base font-medium transition-colors"
                    title="Trending movies this week"
                  >
                    Trending
                  </Link>
                  <Link 
                    href="/blog" 
                    className="text-gray-300 hover:text-[#E0B15C] block px-3 py-2 text-base font-medium transition-colors"
                    title="Movie guides and reviews"
                  >
                    Blog
                  </Link>
        </div>
      </div>
    </nav>
  );
}

