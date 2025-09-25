import { NextRequest, NextResponse } from 'next/server';
import { jobScheduler } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

// GET /api/admin/jobs - List all jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.log('📋 Fetching jobs...');

    // Get all jobs
    const allJobs = await jobScheduler.getAllJobs();
    
    // Filter by status if provided
    const filteredJobs = status 
      ? allJobs.filter(job => job.status === status)
      : allJobs;

    // Limit results
    const jobs = filteredJobs.slice(0, limit);

    console.log(`📊 Found ${jobs.length} jobs (${allJobs.length} total)`);

    return NextResponse.json({
      success: true,
      jobs,
      total: allJobs.length,
      filtered: jobs.length,
      status: status || 'all'
    });

  } catch (error) {
    console.error('Jobs API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/admin/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, payload, priority = 'medium', scheduled_at } = body;

    if (!name || !type) {
      return NextResponse.json({
        success: false,
        message: 'Job name and type are required'
      }, { status: 400 });
    }

    console.log(`➕ Creating job: ${name} (${type})`);

    const job = await jobScheduler.schedule({
      name,
      type,
      payload,
      priority,
      scheduled_at
    });

    console.log(`✅ Job created: ${job.id}`);

    return NextResponse.json({
      success: true,
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create job',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}