import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import SearchForm from '@/components/SearchForm';

export const metadata: Metadata = {
  title: 'Search Movies | What to Watch Tonight',
  description: 'Search for movies and TV shows. Find the perfect film to watch tonight with our comprehensive search. Browse by title, genre, year, rating, and more.',
  keywords: 'search movies, find movies, movie search, film search, search TV shows, movie finder, film finder',
  openGraph: {
    title: 'Search Movies | What to Watch Tonight',
    description: 'Search for movies and TV shows. Find the perfect film to watch tonight.',
    type: 'website',
  },
  alternates: {
    canonical: '/search',
  },
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Search Movies & TV Shows
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Find the perfect movie or TV show to watch tonight. Search by title, genre, year, rating, or browse our curated collections.
          </p>

          <SearchForm />
        </div>
      </main>
    </div>
  );
}