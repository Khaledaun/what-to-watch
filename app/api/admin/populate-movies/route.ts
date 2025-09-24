import { NextRequest, NextResponse } from 'next/server';
import { MoviePopulator } from '@/lib/populate-movies';

// POST /api/admin/populate-movies - Populate top 2000 movies
export async function POST(request: NextRequest) {
  try {
    const populator = new MoviePopulator();
    
    // Start the population process
    populator.populateTopMovies().catch(error => {
      console.error('Movie population error:', error);
    });

    return NextResponse.json({
      message: 'Movie population started successfully',
      status: 'running',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Movie population error:', error);
    return NextResponse.json({
      error: 'Failed to start movie population',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/admin/populate-movies - Get movie population stats
export async function GET(request: NextRequest) {
  try {
    const populator = new MoviePopulator();
    const stats = await populator.getMovieStats();

    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Movie stats error:', error);
    return NextResponse.json({
      error: 'Failed to fetch movie stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

