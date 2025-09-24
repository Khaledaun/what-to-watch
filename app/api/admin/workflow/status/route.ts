import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const client = db.ensureClient();
    
    if (!client) {
      // Return mock workflow status when database is not available
      return NextResponse.json({
        success: true,
        steps: [
          {
            id: '1',
            title: 'Content Discovery',
            status: 'completed',
            description: 'Analyzing trending movies and TV shows',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            duration: 2500
          },
          {
            id: '2',
            title: 'Topic Generation',
            status: 'completed',
            description: 'Generating article topics using AI',
            timestamp: new Date(Date.now() - 180000).toISOString(),
            duration: 3200
          },
          {
            id: '3',
            title: 'Content Creation',
            status: 'running',
            description: 'Creating articles from generated topics',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            duration: null
          },
          {
            id: '4',
            title: 'SEO Optimization',
            status: 'pending',
            description: 'Optimizing content for search engines',
            timestamp: null,
            duration: null
          },
          {
            id: '5',
            title: 'Publishing',
            status: 'pending',
            description: 'Publishing optimized content',
            timestamp: null,
            duration: null
          }
        ],
        lastUpdated: new Date().toISOString()
      });
    }

    // Fetch workflow status from database
    const { data: workflowSteps, error } = await client
      .from('workflow_steps')
      .select('*')
      .order('step_order', { ascending: true });

    if (error) {
      console.error('Error fetching workflow steps:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch workflow status',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      steps: workflowSteps || [],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Workflow status API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch workflow status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}