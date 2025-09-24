import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { jobExecutor } from '@/lib/jobs';
import { z } from 'zod';

// Update job schema
const updateJobSchema = z.object({
  status: z.enum(['queued', 'running', 'done', 'failed']).optional(),
  error: z.string().optional(),
});

// GET /api/admin/jobs/[id] - Get job details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: job, error } = await db.ensureClient()
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get job logs
    const { data: logs, error: logsError } = await db.ensureClient()
      .from('job_logs')
      .select('*')
      .eq('job_id', params.id)
      .order('ts', { ascending: false });

    if (logsError) {
      console.error('Failed to fetch job logs:', logsError);
    }

    return NextResponse.json({ job, logs: logs || [] });
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/jobs/[id] - Update job
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    const job = await db.updateJob(params.id, validatedData);

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Update job error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/jobs/[id]/retry - Retry job
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: job, error } = await db.ensureClient()
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Reset job status and execute
    await db.updateJob(params.id, {
      status: 'queued',
      error: undefined,
      attempts: 0
    });

    // Execute job in background
    jobExecutor.executeJob(job).catch(console.error);

    return NextResponse.json({ message: 'Job queued for retry' });
  } catch (error) {
    console.error('Retry job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/jobs/[id] - Cancel job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: job, error } = await db.ensureClient()
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.status === 'running') {
      return NextResponse.json({ error: 'Cannot cancel running job' }, { status: 400 });
    }

    await db.updateJob(params.id, {
      status: 'failed',
      error: 'Cancelled by user'
    });

    return NextResponse.json({ message: 'Job cancelled' });
  } catch (error) {
    console.error('Cancel job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
