import { NextRequest, NextResponse } from 'next/server';
import { jobExecutor, jobScheduler } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Processing scheduled jobs...');

    // Get all pending jobs using the real job system
    const pendingJobs = await jobScheduler.getPendingJobs();
    console.log(`Found ${pendingJobs.length} pending jobs`);

    if (pendingJobs.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No pending jobs to process',
        jobs: []
      });
    }

    // Process each job using the real job executor
    const processedJobs = [];
    let successCount = 0;
    let failedCount = 0;

    for (const job of pendingJobs) {
      try {
        console.log(`⚡ Processing job: ${job.name} (ID: ${job.id})`);
        await jobExecutor.execute(job);
        successCount++;
        
        processedJobs.push({
          id: job.id,
          name: job.name,
          type: job.type,
          status: 'completed',
          result: 'Job completed successfully'
        });
        
        console.log(`✅ Job completed: ${job.name}`);
      } catch (error) {
        console.error(`❌ Job failed: ${job.name}`, error);
        failedCount++;
        
        processedJobs.push({
          id: job.id,
          name: job.name,
          type: job.type,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const message = `Processed ${processedJobs.length} jobs (${successCount} successful, ${failedCount} failed)`;
    console.log(`📊 Job processing complete: ${message}`);

    return NextResponse.json({
      success: true,
      processed: processedJobs.length,
      successful: successCount,
      failed: failedCount,
      message,
      jobs: processedJobs
    });

  } catch (error) {
    console.error('Process jobs API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process jobs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
