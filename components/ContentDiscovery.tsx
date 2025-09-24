"use client";
import { useState, useEffect } from 'react';
import MovieCarousel from './MovieCarousel';
import { generateCollectionLD } from '@/lib/structured-data';

interface Movie {
  id: string;
  title: string;
  slug: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

interface CarouselData {
  trending: Movie[];
  topRated: Movie[];
  recent: Movie[];
  family: Movie[];
  action: Movie[];
  comedy: Movie[];
}

export default function ContentDiscovery() {
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        
        // Fetch all carousel data in parallel
        const [trendingRes, topRatedRes, recentRes] = await Promise.all([
          fetch('/api/movies/trending?limit=10'),
          fetch('/api/movies/top-rated?limit=10'),
          fetch('/api/movies/recent?limit=10')
        ]);

        const [trendingData, topRatedData, recentData] = await Promise.all([
          trendingRes.json(),
          topRatedRes.json(),
          recentRes.json()
        ]);

        // For now, we'll use the same data for different categories
        // In a real implementation, you'd have separate endpoints for each category
        setCarouselData({
          trending: trendingData.movies || [],
          topRated: topRatedData.movies || [],
          recent: recentData.movies || [],
          family: trendingData.movies?.slice(0, 8) || [], // Mock family movies
          action: topRatedData.movies?.slice(0, 8) || [], // Mock action movies
          comedy: recentData.movies?.slice(0, 8) || [], // Mock comedy movies
        });

      } catch (error) {
        console.error('Error fetching carousel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E0B15C]"></div>
          <p className="text-gray-400 mt-4">Loading movie collections...</p>
        </div>
      </section>
    );
  }

  if (!carouselData) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-400">Unable to load movie collections. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12" aria-label="Movie Collections">
      {/* Trending This Week */}
      {carouselData.trending.length > 0 && (
        <MovieCarousel
          title="Trending This Week"
          movies={carouselData.trending}
          href="/movies/trending"
          description="The most popular movies right now"
        />
      )}

      {/* Top Rated Movies */}
      {carouselData.topRated.length > 0 && (
        <MovieCarousel
          title="Critics' Choice"
          movies={carouselData.topRated}
          href="/movies/top-rated"
          description="Highest rated movies of all time"
        />
      )}

      {/* Recent Releases */}
      {carouselData.recent.length > 0 && (
        <MovieCarousel
          title="New Releases"
          movies={carouselData.recent}
          href="/movies/recent"
          description="Latest movies just released"
        />
      )}

      {/* Family Movies */}
      {carouselData.family.length > 0 && (
        <MovieCarousel
          title="Family Favorites"
          movies={carouselData.family}
          href="/movies/family"
          description="Perfect for family movie night"
        />
      )}

      {/* Action Movies */}
      {carouselData.action.length > 0 && (
        <MovieCarousel
          title="Action & Adventure"
          movies={carouselData.action}
          href="/movies/action"
          description="High-octane thrills and excitement"
        />
      )}

      {/* Comedy Movies */}
      {carouselData.comedy.length > 0 && (
        <MovieCarousel
          title="Comedy Gold"
          movies={carouselData.comedy}
          href="/movies/comedy"
          description="Laugh-out-loud entertainment"
        />
      )}
    </section>
  );
}

