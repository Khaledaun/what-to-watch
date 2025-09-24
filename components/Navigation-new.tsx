import Link from "next/link";
import { AuthButton } from "./Auth";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-slate-900">
                What to Watch
              </h1>
            </div>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/movies" 
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Movies
              </Link>
              <Link 
                href="/what-to-watch/tonight" 
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Tonight
              </Link>
              <Link 
                href="/blog" 
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Blog
              </Link>
              <Link 
                href="/search" 
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Search
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AuthButton />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2"
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
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
          <Link 
            href="/movies" 
            className="text-slate-600 hover:text-slate-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Movies
          </Link>
          <Link 
            href="/what-to-watch/tonight" 
            className="text-slate-600 hover:text-slate-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Tonight
          </Link>
          <Link 
            href="/blog" 
            className="text-slate-600 hover:text-slate-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Blog
          </Link>
          <Link 
            href="/search" 
            className="text-slate-600 hover:text-slate-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
          >
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
}


