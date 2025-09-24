import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/database';
import { generateMovieLD, generateBreadcrumbLD } from '@/lib/structured-data';
import Image from 'next/image';
import Link from 'next/link';
import AffiliateTracker from '@/components/AffiliateTracker';

interface MoviePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { data: movie, error } = await db.ensureClient()
    .from('titles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !movie) {
    return {
      title: 'Movie Not Found',
      description: 'The requested movie could not be found.',
    };
  }

  const title = `${movie.title} (${new Date(movie.release_date).getFullYear()}) - What to Watch Tonight`;
  const description = movie.overview || `Watch ${movie.title} - Find where to stream this movie on your favorite platforms.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          width: 500,
          height: 750,
          alt: `${movie.title} movie poster`,
        },
      ],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://image.tmdb.org/t/p/w500${movie.poster_path}`],
    },
    alternates: {
      canonical: `https://whattowatch.com/movie/${movie.slug}`,
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { data: movie, error } = await db.ensureClient()
    .from('titles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !movie) {
    notFound();
  }

  // Generate structured data
  const movieLD = generateMovieLD({
    title: movie.title,
    description: movie.overview || '',
    releaseDate: movie.release_date,
    duration: `PT${120}M`, // Default duration, should be fetched from TMDB
    rating: movie.vote_average || 0,
    genre: ['Drama'], // Should be fetched from TMDB
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    url: `https://whattowatch.com/movie/${movie.slug}`,
    streamingPlatforms: ['netflix', 'prime'], // Should be fetched from availability data
  });

  const breadcrumbLD = generateBreadcrumbLD([
    { name: 'Home', url: '/' },
    { name: 'Movies', url: '/movies' },
    { name: movie.title, url: `/movie/${movie.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#0A1220] text-white">
      {/* Affiliate Tracking */}
      <AffiliateTracker movieId={movie.id} movieTitle={movie.title} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(movieLD)
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
            {movie.title}
          </li>
        </ol>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-6xl mx-auto">
          {/* Movie Hero Section */}
          <header className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} movie poster`}
                width={500}
                height={750}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                {movie.title}
                <span className="block text-2xl text-gray-400 font-normal">
                  ({new Date(movie.release_date).getFullYear()})
                </span>
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#E0B15C] font-bold text-lg">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-gray-400">IMDb</span>
                </div>
                <div className="w-px h-6 bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E0B15C] font-bold text-lg">
                    {Math.round((movie.vote_average || 0) * 10)}%
                  </span>
                  <span className="text-gray-400">Rotten Tomatoes</span>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {movie.overview || 'No description available.'}
              </p>

              {/* Streaming Options - Affiliate CTA Placeholders */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Where to Watch</h2>
                
                {/* Primary CTA - Most Prominent */}
                <div className="bg-gradient-to-r from-[#E0B15C] to-[#F2C879] p-6 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[#0A1220] font-bold text-lg">Watch Now on Netflix</h3>
                      <p className="text-[#0A1220]/80 text-sm">Start your free trial today</p>
                    </div>
                    <button 
                      className="bg-[#0A1220] hover:bg-[#0A1220]/90 text-[#E0B15C] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      data-affiliate="netflix"
                      data-movie-id={movie.id}
                      data-cta-type="primary"
                    >
                      Watch Now →
                    </button>
                  </div>
                </div>

                {/* Secondary CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-between group"
                    data-affiliate="prime"
                    data-movie-id={movie.id}
                    data-cta-type="secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">P</span>
                      </div>
                      <span>Prime Video</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-between group"
                    data-affiliate="hulu"
                    data-movie-id={movie.id}
                    data-cta-type="secondary"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                      </div>
                      <span>Hulu</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

                {/* Additional Platforms */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    data-affiliate="disney-plus"
                    data-movie-id={movie.id}
                    data-cta-type="tertiary"
                  >
                    Disney+
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    data-affiliate="max"
                    data-movie-id={movie.id}
                    data-cta-type="tertiary"
                  >
                    Max
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    data-affiliate="apple-tv-plus"
                    data-movie-id={movie.id}
                    data-cta-type="tertiary"
                  >
                    Apple TV+
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Movie Details */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">About This Movie</h2>
              <div className="space-y-4 text-gray-300">
                <p><strong className="text-white">Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
                <p><strong className="text-white">Runtime:</strong> 120 minutes</p>
                <p><strong className="text-white">Genre:</strong> Drama, Action</p>
                <p><strong className="text-white">Language:</strong> {movie.original_language?.toUpperCase()}</p>
                <p><strong className="text-white">Popularity:</strong> {movie.popularity?.toFixed(0)}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
              <div className="space-y-4">
                <p className="text-gray-400">More recommendations coming soon...</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A1220] border-t border-white/10 p-4 md:hidden z-50">
        <button 
          className="w-full bg-[#E0B15C] hover:bg-[#F2C879] text-[#0A1220] py-4 rounded-xl font-bold text-lg transition-colors"
          data-affiliate="netflix"
          data-movie-id={movie.id}
          data-cta-type="sticky"
        >
          Watch {movie.title} on Netflix →
        </button>
      </div>
    </div>
  );
}