import { NextRequest, NextResponse } from 'next/server';
import { jobScheduler } from '@/lib/jobs';

// POST /api/cron/process-jobs - Process job queue
export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow if no CRON_SECRET is set (for development) or if auth matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Processing job queue...');
    
    // Process the job queue
    const result = await jobScheduler.processJobQueue();

    return NextResponse.json({ 
      message: 'Job queue processed successfully',
      processed: result?.processed || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/cron/process-jobs - Health check
export async function GET() {
  return NextResponse.json({ 
    message: 'Cron endpoint is healthy',
    timestamp: new Date().toISOString()
  });
}
