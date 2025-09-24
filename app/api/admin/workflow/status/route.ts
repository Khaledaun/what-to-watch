import { NextRequest, NextResponse } from 'next/server';
import { jobScheduler } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get job status from the job scheduler
    const jobs = await jobScheduler.listJobs();
    
    // Calculate statistics
    const stats = {
      total: jobs.length,
      queued: jobs.filter(job => job.status === 'queued').length,
      running: jobs.filter(job => job.status === 'running').length,
      completed: jobs.filter(job => job.status === 'completed').length,
      failed: jobs.filter(job => job.status === 'failed').length,
      cancelled: jobs.filter(job => job.status === 'cancelled').length
    };

    return NextResponse.json({
      success: true,
      jobs,
      stats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Workflow status API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch workflow status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, jobId, jobData } = body;

    switch (action) {
      case 'create':
        if (!jobData) {
          return NextResponse.json({ error: 'Job data required' }, { status: 400 });
        }
        const newJob = await jobScheduler.schedule(jobData);
        return NextResponse.json({ success: true, job: newJob });

      case 'cancel':
        if (!jobId) {
          return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
        }
        await jobScheduler.cancel(jobId);
        return NextResponse.json({ success: true, message: 'Job cancelled' });

      case 'retry':
        if (!jobId) {
          return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
        }
        await jobScheduler.retry(jobId);
        return NextResponse.json({ success: true, message: 'Job retried' });

      case 'process':
        await jobScheduler.processQueue();
        return NextResponse.json({ success: true, message: 'Queue processed' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Workflow action API error:', error);
    return NextResponse.json({
      error: 'Failed to perform workflow action',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}