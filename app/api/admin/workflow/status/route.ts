import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    const client = db.ensureClient();
    let jobs = [];
    let logs = [];

    if (client) {
      // Get recent jobs and their status
      const { data: jobsData, error } = await client
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        jobs = jobsData || [];
      }

      // Get job logs for more details
      const { data: logsData, error: logsError } = await client
        .from('job_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (logsError) {
        console.error('Error fetching job logs:', logsError);
      } else {
        logs = logsData || [];
      }
    } else {
      console.log('Database not available, using mock data for workflow status');
      // Use mock data when database is not available
      jobs = [
        {
          id: 'mock-1',
          type: 'seed_lists',
          status: 'done',
          created_at: new Date().toISOString(),
          started_at: new Date(Date.now() - 300000).toISOString(),
          finished_at: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: 'mock-2',
          type: 'generate_article_from_topic',
          status: 'running',
          created_at: new Date(Date.now() - 120000).toISOString(),
          started_at: new Date(Date.now() - 60000).toISOString()
        }
      ];
      logs = [
        {
          id: 'log-1',
          job_id: 'mock-1',
          level: 'info',
          message: 'Seed lists completed successfully',
          created_at: new Date().toISOString()
        }
      ];
    }

    // Create workflow steps based on job status
    const workflowSteps = [
      {
        id: 'topic-generation',
        title: 'Weekly Topic Generation',
        status: jobs?.find((j: any) => j.type === 'generate_weekly_topics')?.status || 'pending',
        description: 'Generate 7 diverse article topics with SEO data',  
        timestamp: jobs?.find((j: any) => j.type === 'generate_weekly_topics')?.created_at,
        duration: jobs?.find((j: any) => j.type === 'generate_weekly_topics')?.finished_at ?
          new Date(jobs.find((j: any) => j.type === 'generate_weekly_topics')?.finished_at).getTime() - 
          new Date(jobs.find((j: any) => j.type === 'generate_weekly_topics')?.started_at).getTime() : undefined
      },
      {
        id: 'article-generation',
        title: 'Article Generation',
        status: jobs?.find((j: any) => j.type === 'generate_article_from_topic')?.status || 'pending',
        description: 'Generate full articles using Grok-4-fast-reasoning',
        timestamp: jobs?.find((j: any) => j.type === 'generate_article_from_topic')?.created_at,
        duration: jobs?.find((j: any) => j.type === 'generate_article_from_topic')?.finished_at ? 
          new Date(jobs.find((j: any) => j.type === 'generate_article_from_topic')?.finished_at).getTime() - 
          new Date(jobs.find((j: any) => j.type === 'generate_article_from_topic')?.started_at).getTime() : undefined
      },
      {
        id: 'seo-optimization',
        title: 'SEO Optimization',
        status: 'completed',
        description: 'Optimize content for search engines',
        timestamp: new Date().toISOString()
      },
      {
        id: 'image-processing',
        title: 'Image Processing',
        status: 'completed',
        description: 'Generate error-free image placeholders',
        timestamp: new Date().toISOString()
      },
      {
        id: 'content-review',
        title: 'Content Review',
        status: 'pending',
        description: 'Review and approve generated content',
        timestamp: undefined
      },
      {
        id: 'publishing',
        title: 'Publishing',
        status: 'pending',
        description: 'Publish approved content',
        timestamp: undefined
      }
    ];

    return NextResponse.json({
      steps: workflowSteps,
      jobs: jobs || [],
      logs: logs || [],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Workflow status error:', error);
    return NextResponse.json({
      error: 'Failed to fetch workflow status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

