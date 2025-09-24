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
      slug: 'oppenheimer-2023',
      title: 'Oppenheimer',
      year: 2023,
      runtime: 180,
      vote_average: 8.1,
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      type: 'movie'
    },
    {
      id: '2',
      slug: 'spider-man-across-the-spider-verse-2023',
      title: 'Spider-Man: Across the Spider-Verse',
      year: 2023,
      runtime: 140,
      vote_average: 8.6,
      poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      type: 'movie'
    },
    {
      id: '3',
      slug: 'the-bear-2022',
      title: 'The Bear',
      year: 2022,
      episode_count: 18,
      vote_average: 8.6,
      poster_path: '/y8V0Xq2ni6j4uzku60Lo7UpF5zK.jpg',
      type: 'tv'
    },
    {
      id: '4',
      slug: 'succession-2018',
      title: 'Succession',
      year: 2018,
      episode_count: 39,
      vote_average: 8.8,
      poster_path: '/y8Vj6QJ8V8V8V8V8V8V8V8V8V8V8V.jpg',
      type: 'tv'
    },
    {
      id: '5',
      slug: 'the-dark-knight-2008',
      title: 'The Dark Knight',
      year: 2008,
      runtime: 152,
      vote_average: 9.0,
      poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      type: 'movie'
    },
    {
      id: '6',
      slug: 'avengers-endgame-2019',
      title: 'Avengers: Endgame',
      year: 2019,
      runtime: 181,
      vote_average: 8.4,
      poster_path: '/or06FN3Dka5tukK1e9Sl1agdqL2.jpg',
      type: 'movie'
    },
    {
      id: '7',
      slug: 'avengers-infinity-war-2018',
      title: 'Avengers: Infinity War',
      year: 2018,
      runtime: 149,
      vote_average: 8.3,
      poster_path: '/7WwJ2o7fJz4GjCg5x50bEw0F4g.jpg',
      type: 'movie'
    },
    {
      id: '8',
      slug: 'the-godfather-1972',
      title: 'The Godfather',
      year: 1972,
      runtime: 175,
      vote_average: 8.7,
      poster_path: '/3bhkrj58Vtu7enYsRolD1PhCaJG.jpg',
      type: 'movie'
    },
    {
      id: '9',
      slug: 'the-lord-of-the-rings-return-of-the-king-2003',
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
      runtime: 201,
      vote_average: 8.7,
      poster_path: '/rCzpDGLbOoPwLjmWUSLCPG9au5DD.jpg',
      type: 'movie'
    },
    {
      id: '10',
      slug: 'pulp-fiction-1994',
      title: 'Pulp Fiction',
      year: 1994,
      runtime: 154,
      vote_average: 8.5,
      poster_path: '/d5iIlFn5s0ImszYzBMXv́p9tX7i.jpg',
      type: 'movie'
    }
  ];

  return fallbackMovies.slice(0, limit);
}