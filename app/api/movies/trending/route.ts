import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const client = db.ensureClient();
    let movies = [];

    if (client) {
      // Try to fetch from database
      const { data, error } = await client
        .from('titles')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Database error:', error);
      } else {
        movies = data || [];
        // Check if movies have poster_path, if not use fallback
        const moviesWithoutPosters = movies.filter(movie => !movie.poster_path);
        if (moviesWithoutPosters.length > 0) {
          console.log(`Found ${moviesWithoutPosters.length} movies without poster_path, using fallback data`);
          movies = getFallbackMovies(limit);
        }
      }
    }

    // If no movies from database, use fallback data
    if (movies.length === 0) {
      movies = getFallbackMovies(limit);
    }

    return NextResponse.json({
      movies,
      total: movies.length,
      limit
    });

  } catch (error) {
    console.error('Trending movies API error:', error);
    
    // Return fallback data on error
    const fallbackMovies = getFallbackMovies(10);
    return NextResponse.json({
      movies: fallbackMovies,
      total: fallbackMovies.length,
      limit: 10,
      error: 'Using fallback data'
    });
  }
}

function getFallbackMovies(limit: number) {
  const fallbackMovies = [
    {
      id: '1',
      slug: 'the-dark-knight-2008',
      title: 'The Dark Knight',
      year: 2008,
      runtime: 152,
      vote_average: 9.0,
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      type: 'movie'
    },
    {
      id: '2',
      slug: 'avengers-endgame-2019',
      title: 'Avengers: Endgame',
      year: 2019,
      runtime: 181,
      vote_average: 8.4,
      poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      type: 'movie'
    },
    {
      id: '3',
      slug: 'avengers-infinity-war-2018',
      title: 'Avengers: Infinity War',
      year: 2018,
      runtime: 149,
      vote_average: 8.4,
      poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
      type: 'movie'
    },
    {
      id: '4',
      slug: 'the-godfather-1972',
      title: 'The Godfather',
      year: 1972,
      runtime: 175,
      vote_average: 9.2,
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      type: 'movie'
    },
    {
      id: '5',
      slug: 'the-lord-of-the-rings-the-fellowship-of-the-ring-2001',
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
      runtime: 178,
      vote_average: 8.8,
      poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      type: 'movie'
    },
    {
      id: '6',
      slug: 'the-lord-of-the-rings-the-two-towers-2002',
      title: 'The Lord of the Rings: The Two Towers',
      year: 2002,
      runtime: 179,
      vote_average: 8.7,
      poster_path: '/5VTN0pR8gcqV3EPUHHfMGn5EF1B.jpg',
      type: 'movie'
    },
    {
      id: '7',
      slug: 'forrest-gump-1994',
      title: 'Forrest Gump',
      year: 1994,
      runtime: 142,
      vote_average: 8.8,
      poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      type: 'movie'
    },
    {
      id: '8',
      slug: 'the-lord-of-the-rings-the-return-of-the-king-2003',
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
      runtime: 201,
      vote_average: 8.9,
      poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      type: 'movie'
    },
    {
      id: '9',
      slug: 'the-shawshank-redemption-1994',
      title: 'The Shawshank Redemption',
      year: 1994,
      runtime: 142,
      vote_average: 9.3,
      poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      type: 'movie'
    },
    {
      id: '10',
      slug: 'fight-club-1999',
      title: 'Fight Club',
      year: 1999,
      runtime: 139,
      vote_average: 8.8,
      poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      type: 'movie'
    }
  ];

  return fallbackMovies.slice(0, limit);
}