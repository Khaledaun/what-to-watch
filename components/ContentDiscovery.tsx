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
        
        // Try to fetch from API, but use fallback data if it fails
        let trendingData = { movies: [] };
        let topRatedData = { movies: [] };
        let recentData = { movies: [] };

        try {
          const [trendingRes, topRatedRes, recentRes] = await Promise.all([
            fetch('/api/movies/trending?limit=10'),
            fetch('/api/movies/top-rated?limit=10'),
            fetch('/api/movies/recent?limit=10')
          ]);

          [trendingData, topRatedData, recentData] = await Promise.all([
            trendingRes.json(),
            topRatedRes.json(),
            recentRes.json()
          ]);
        } catch (apiError) {
          console.error('API fetch failed, using fallback data:', apiError);
          // Use fallback data when API fails
          const fallbackMovies = getFallbackMovies();
          trendingData = { movies: fallbackMovies };
          topRatedData = { movies: fallbackMovies };
          recentData = { movies: fallbackMovies };
        }

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
        // Use fallback data on any error
        const fallbackMovies = getFallbackMovies();
        setCarouselData({
          trending: fallbackMovies,
          topRated: fallbackMovies,
          recent: fallbackMovies,
          family: fallbackMovies.slice(0, 8),
          action: fallbackMovies.slice(0, 8),
          comedy: fallbackMovies.slice(0, 8),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  // Helper function for fallback movies
  function getFallbackMovies(): Movie[] {
    return [
      {
        id: '1',
        title: 'Oppenheimer',
        slug: 'oppenheimer-2023',
        release_date: '2023-07-21',
        poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        vote_average: 8.1,
        overview: 'Christopher Nolan\'s epic biopic about the father of the atomic bomb.'
      },
      {
        id: '2',
        title: 'Spider-Man: Across the Spider-Verse',
        slug: 'spider-man-across-the-spider-verse-2023',
        release_date: '2023-06-02',
        poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        vote_average: 8.6,
        overview: 'Miles Morales returns in this stunning animated sequel.'
      },
      {
        id: '3',
        title: 'The Bear',
        slug: 'the-bear-2022',
        release_date: '2022-06-23',
        poster_path: '/y8V0Xq2ni6j4uzku60Lo7UpF5zK.jpg',
        vote_average: 8.6,
        overview: 'Intense kitchen drama that\'s both stressful and heartwarming.'
      },
      {
        id: '4',
        title: 'Succession',
        slug: 'succession-2018',
        release_date: '2018-06-03',
        poster_path: '/y8Vj6QJ8V8V8V8V8V8V8V8V8V8V8V.jpg',
        vote_average: 8.8,
        overview: 'A drama about a dysfunctional media dynasty.'
      },
      {
        id: '5',
        title: 'The Dark Knight',
        slug: 'the-dark-knight-2008',
        release_date: '2008-07-18',
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        vote_average: 9.0,
        overview: 'Batman faces the Joker in this epic superhero film.'
      }
    ];
  }

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


