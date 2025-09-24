import { Metadata } from 'next';
import { db } from '@/lib/database';
import { generateCollectionLD, generateBreadcrumbLD } from '@/lib/structured-data';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Trending Movies This Week - What to Watch Tonight',
  description: 'Discover the most popular and trending movies this week. Find what everyone is watching right now.',
  openGraph: {
    title: 'Trending Movies This Week - What to Watch Tonight',
    description: 'Discover the most popular and trending movies this week. Find what everyone is watching right now.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://whattowatch.com/movies/trending',
  },
};

export default async function TrendingMoviesPage() {
  // Fetch trending movies
  const { data: movies, error } = await db.ensureClient()
    .from('titles')
    .select('*')
    .order('popularity', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching trending movies:', error);
  }

  // Generate structured data
  const collectionLD = generateCollectionLD({
    name: 'Trending Movies This Week',
    description: 'Discover the most popular and trending movies this week. Find what everyone is watching right now.',
    items: movies?.map((movie: any) => ({
      name: movie.title,
      url: `/movie/${movie.slug}`,
      type: 'Movie' as const,
    })) || [],
    url: 'https://whattowatch.com/movies/trending',
  });

  const breadcrumbLD = generateBreadcrumbLD([
    { name: 'Home', url: '/' },
    { name: 'Movies', url: '/movies' },
    { name: 'Trending', url: '/movies/trending' },
  ]);

  return (
    <div className="min-h-screen bg-[#0A1220] text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionLD)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLD)
        }}
      />

      {/* Navigation */}
      <nav className="bg-[#0A1220]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-2xl font-bold text-[#E0B15C]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              What to Watch Tonight
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/movies" className="text-gray-300 hover:text-[#E0B15C] transition-colors text-sm font-medium">
                Movies
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-[#E0B15C] transition-colors text-sm font-medium">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-400">
          <li>
            <Link href="/" className="hover:text-[#E0B15C] transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <Link href="/movies" className="hover:text-[#E0B15C] transition-colors">
              Movies
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-white" aria-current="page">
            Trending
          </li>
        </ol>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            Trending Movies This Week
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the most popular and trending movies this week. Find what everyone is watching right now.
          </p>
        </header>

        {/* Trending Movies Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies?.map((movie: any) => (
              <Link key={movie.id} href={`/movie/${movie.slug}`} className="group">
                <article className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.title} movie poster`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#E0B15C] text-[#0A1220] text-xs px-2 py-1 rounded-full font-bold">
                        #{movies.indexOf(movie) + 1}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#E0B15C] transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-[#E0B15C] font-medium">
                        {movie.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-400">★</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

