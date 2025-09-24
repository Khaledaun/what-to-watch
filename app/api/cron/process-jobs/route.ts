import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const client = db.ensureClient();
    
    if (!client) {
      // Return mock response when database is not available
      return NextResponse.json({
        success: true,
        processed: 3,
        message: 'Processed mock jobs (database not available)',
        jobs: [
          {
            id: '1',
            type: 'content_generation',
            status: 'completed',
            result: 'Generated article: Top 10 Action Movies on Netflix 2024'
          },
          {
            id: '2',
            type: 'seo_optimization',
            status: 'completed',
            result: 'Optimized SEO for 5 articles'
          },
          {
            id: '3',
            type: 'image_processing',
            status: 'completed',
            result: 'Processed 12 movie poster images'
          }
        ]
      });
    }

    // Get pending jobs from database
    const { data: pendingJobs, error: fetchError } = await client
      .from('job_logs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error('Error fetching pending jobs:', fetchError);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch pending jobs',
        error: fetchError.message
      }, { status: 500 });
    }

    if (!pendingJobs || pendingJobs.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No pending jobs to process'
      });
    }

    // Process each job
    const processedJobs = [];
    for (const job of pendingJobs) {
      try {
        // Simulate job processing
        const result = await processJob(job);
        
        // Update job status
        const { error: updateError } = await client
          .from('job_logs')
          .update({
            status: 'completed',
            result: result,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);

        if (updateError) {
          console.error('Error updating job:', updateError);
          continue;
        }

        processedJobs.push({
          id: job.id,
          type: job.job_type,
          status: 'completed',
          result: result
        });

      } catch (jobError) {
        console.error('Error processing job:', jobError);
        
        // Mark job as failed
        await client
          .from('job_logs')
          .update({
            status: 'failed',
            error: jobError instanceof Error ? jobError.message : 'Unknown error',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);

        processedJobs.push({
          id: job.id,
          type: job.job_type,
          status: 'failed',
          error: jobError instanceof Error ? jobError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedJobs.length,
      message: `Processed ${processedJobs.length} jobs`,
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

async function processJob(job: any) {
  // Simulate different job types
  switch (job.job_type) {
    case 'content_generation':
      return `Generated article: ${job.data?.title || 'Untitled Article'}`;
    
    case 'seo_optimization':
      return `Optimized SEO for ${job.data?.articleCount || 1} articles`;
    
    case 'image_processing':
      return `Processed ${job.data?.imageCount || 1} images`;
    
    case 'data_sync':
      return `Synced ${job.data?.recordCount || 1} records from TMDB`;
    
    default:
      return `Completed ${job.job_type} job`;
  }
}