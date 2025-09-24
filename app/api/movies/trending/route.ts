import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Get trending movies (high popularity and recent)
    const { data: movies, error } = await db.ensureClient()
      .from('titles')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending movies:', error);
      return NextResponse.json({ error: 'Failed to fetch trending movies', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      movies: movies || [],
      count: movies?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error fetching trending movies:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

