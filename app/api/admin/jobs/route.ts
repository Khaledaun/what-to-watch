import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';
import { jobScheduler } from '@/lib/jobs';
import { z } from 'zod';

// Create job schema
const createJobSchema = z.object({
  type: z.enum([
    'seed_lists',
    'changes_scan',
    'hydrate_title',
    'refresh_providers',
    'build_factsheet',
    'twice_weekly_content_pack',
    'refresh_affiliates',
    'link_health_check',
    'ingest_news_feeds',
    'news_entity_linking'
  ]),
  payload: z.any().optional(),
  scheduled_for: z.string().optional(),
});

// GET /api/admin/jobs - List jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db.ensureClient().from('jobs').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data: jobs, error } = await query
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/jobs - Create job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createJobSchema.parse(body);

    const job = await jobScheduler.schedule({
      type: validatedData.type,
      payload: validatedData.payload,
      priority: 'medium',
      maxAttempts: 3,
      scheduledAt: validatedData.scheduled_for || new Date().toISOString()
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Create job error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
