import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Get top-rated movies (high vote average with minimum vote count)
    const { data: movies, error } = await db.ensureClient()
      .from('titles')
      .select('*')
      .gte('vote_count', 100) // Minimum vote count for reliability
      .order('vote_average', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top-rated movies:', error);
      return NextResponse.json({ error: 'Failed to fetch top-rated movies', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      movies: movies || [],
      count: movies?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error fetching top-rated movies:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}


