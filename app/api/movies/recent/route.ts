import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Get recent movies (released in the last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const { data: movies, error } = await db.ensureClient()
      .from('titles')
      .select('*')
      .gte('release_date', twoYearsAgo.toISOString().split('T')[0])
      .order('release_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent movies:', error);
      return NextResponse.json({ error: 'Failed to fetch recent movies', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      movies: movies || [],
      count: movies?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error fetching recent movies:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}


