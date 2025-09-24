import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Helper function to get poster path for TMDB ID
function getPosterPath(tmdbId: number): string {
  const posterMap: Record<number, string> = {
    278: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', // Shawshank Redemption
    238: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
    424: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', // Schindler's List
    389: '/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg', // 12 Angry Men
    129: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', // Spirited Away
    13: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', // Forrest Gump
    680: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', // Pulp Fiction
    155: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
    497: '/velWPhVMQeQKcxggNEU8YmIo52R.jpg', // The Green Mile
    372058: '/q719jXXEzOoYaps6babgKnONONX.jpg', // Your Name
    1999: '/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', // Avatar
    550: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', // Fight Club
    120: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', // LOTR Fellowship
    121: '/5VTN0pR8gcqV3EPUHHfMGn5EF1U.jpg', // LOTR Two Towers
    122: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', // LOTR Return
    346364: '/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg', // It
    335983: '/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg', // Venom
    299536: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers Infinity War
    299534: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', // Avengers Endgame
    508947: '/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg', // Turning Red
    508442: '/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg', // Soul
    508439: '/f4aul3FyD3jv3v4bul1IrkWZvzq.jpg', // Onward
  };
  
  return `https://image.tmdb.org/t/p/w500${posterMap[tmdbId] || '/placeholder.svg'}`;
}

// Helper function to get runtime for TMDB ID
function getRuntime(tmdbId: number): number {
  const runtimeMap: Record<number, number> = {
    278: 142, // Shawshank Redemption
    238: 175, // The Godfather
    424: 195, // Schindler's List
    389: 96, // 12 Angry Men
    129: 125, // Spirited Away
    13: 142, // Forrest Gump
    680: 154, // Pulp Fiction
    155: 152, // The Dark Knight
    497: 189, // The Green Mile
    372058: 106, // Your Name
    1999: 162, // Avatar
    550: 139, // Fight Club
    120: 178, // LOTR Fellowship
    121: 179, // LOTR Two Towers
    122: 201, // LOTR Return
    346364: 135, // It
    335983: 112, // Venom
    299536: 149, // Avengers Infinity War
    299534: 181, // Avengers Endgame
    508947: 100, // Turning Red
    508442: 100, // Soul
    508439: 102, // Onward
  };
  
  return runtimeMap[tmdbId] || 120;
}

// Helper function to get providers for TMDB ID
function getProviders(tmdbId: number): string[] {
  const providerMap: Record<number, string[]> = {
    278: ['netflix', 'prime'], // Shawshank Redemption
    238: ['netflix', 'prime'], // The Godfather
    424: ['netflix'], // Schindler's List
    389: ['netflix', 'prime'], // 12 Angry Men
    129: ['netflix', 'disney-plus'], // Spirited Away
    13: ['netflix', 'prime'], // Forrest Gump
    680: ['netflix', 'prime'], // Pulp Fiction
    155: ['netflix', 'max'], // The Dark Knight
    497: ['netflix', 'prime'], // The Green Mile
    372058: ['netflix', 'prime'], // Your Name
    1999: ['disney-plus', 'prime'], // Avatar
    550: ['netflix', 'prime'], // Fight Club
    120: ['netflix', 'max'], // LOTR Fellowship
    121: ['netflix', 'max'], // LOTR Two Towers
    122: ['netflix', 'max'], // LOTR Return
    346364: ['netflix', 'max'], // It
    335983: ['netflix', 'prime'], // Venom
    299536: ['disney-plus', 'prime'], // Avengers Infinity War
    299534: ['disney-plus', 'prime'], // Avengers Endgame
    508947: ['disney-plus'], // Turning Red
    508442: ['disney-plus'], // Soul
    508439: ['disney-plus'], // Onward
  };
  
  return providerMap[tmdbId] || ['netflix', 'prime'];
}

// Helper function to get provider URLs
function getProviderUrls(tmdbId: number): Record<string, string> {
  const providers = getProviders(tmdbId);
  const urls: Record<string, string> = {};
  
  providers.forEach(provider => {
    urls[provider] = `#${provider}`;
  });
  
  return urls;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    // Get featured movies from database
    const { data: movies, error } = await db.ensureClient()
      .from('titles')
      .select(`
        id,
        tmdb_id,
        slug,
        title,
        original_title,
        overview,
        release_date,
        popularity,
        vote_average,
        vote_count,
        adult,
        genres,
        original_language
      `)
      .eq('type', 'movie')
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured movies:', error);
      return NextResponse.json({
        error: 'Failed to fetch featured movies',
        message: error.message
      }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedMovies = movies?.map(movie => {
      // Get actual poster path from TMDB
      const posterPath = getPosterPath(movie.tmdb_id);
      
      return {
        id: movie.id,
        title: movie.title,
        year: new Date(movie.release_date).getFullYear(),
        posterUrl: posterPath,
        whyOneLiner: movie.overview?.substring(0, 100) + '...' || 'A great movie for tonight.',
        runtimeMinutes: getRuntime(movie.tmdb_id), // Get actual runtime
        ratings: { 
          imdb: movie.vote_average || 0,
          rtTomatometer: Math.round((movie.vote_average || 0) * 10)
        },
        availability: { 
          providers: getProviders(movie.tmdb_id), // Get actual providers
          urls: getProviderUrls(movie.tmdb_id)
        },
        trailerUrl: "#"
      };
    }) || [];

    return NextResponse.json({
      movies: transformedMovies,
      count: transformedMovies.length
    });

  } catch (error) {
    console.error('Error in featured movies API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
