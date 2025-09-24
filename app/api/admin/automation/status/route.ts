import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock automation status - in a real implementation, this would query the database
    // and check actual automation job statuses
    const automationStatus = {
      overall: 'active' as const,
      nextAction: 'Topic Generation',
      nextActionTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      steps: [
        {
          id: 'data-ingestion',
          name: 'Data Ingestion',
          description: 'Pull latest movie data from TMDB API',
          status: 'completed' as const,
          lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          duration: '15m'
        },
        {
          id: 'normalization',
          name: 'Data Normalization',
          description: 'Clean and standardize movie data',
          status: 'completed' as const,
          lastRun: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
          duration: '5m'
        },
        {
          id: 'factsheet-curation',
          name: 'Factsheet Curation',
          description: 'Generate movie factsheets and metadata',
          status: 'completed' as const,
          lastRun: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
          duration: '10m'
        },
        {
          id: 'topic-generation',
          name: 'Topic Generation',
          description: 'Generate 10 weekly article topics',
          status: 'pending' as const,
          nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
        },
        {
          id: 'content-generation',
          name: 'Content Generation',
          description: 'Generate articles using Grok AI',
          status: 'pending' as const,
          nextRun: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString() // 2.5 hours from now
        },
        {
          id: 'approval',
          name: 'Content Approval',
          description: 'Review and approve generated content',
          status: 'pending' as const
        },
        {
          id: 'publishing',
          name: 'Publishing',
          description: 'Publish approved content to website',
          status: 'pending' as const
        }
      ]
    };

    return NextResponse.json(automationStatus);

  } catch (error) {
    console.error('Error fetching automation status:', error);
    return NextResponse.json({
      error: 'Failed to fetch automation status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


