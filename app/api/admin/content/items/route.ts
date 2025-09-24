import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const client = db.ensureClient();
    
    if (!client) {
      // Return mock content items when database is not available
      return NextResponse.json({
        success: true,
        items: getMockContentItems(limit),
        total: limit,
        lastUpdated: new Date().toISOString()
      });
    }

    // Fetch content items from database
    let query = client.from('content_items').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data: items, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching content items:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch content items',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      items: items || [],
      total: items?.length || 0,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content items API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch content items',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getMockContentItems(limit: number) {
  const mockItems = [
    {
      id: '1',
      title: 'Top 10 Action Movies on Netflix in 2024',
      type: 'topic',
      status: 'draft',
      wordCount: 2500,
      seoScore: 98,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      scheduledAt: null,
      publishedAt: null
    },
    {
      id: '2',
      title: 'How to Watch Popular Movies on All Streaming Platforms',
      type: 'topic',
      status: 'draft',
      wordCount: 2000,
      seoScore: 95,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      scheduledAt: null,
      publishedAt: null
    },
    {
      id: '3',
      title: 'Netflix vs Prime Video: Which Has Better Movies?',
      type: 'article',
      status: 'published',
      wordCount: 2800,
      seoScore: 88,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      scheduledAt: null,
      publishedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: '4',
      title: 'Best Drama Movies on Prime Video: Hidden Gems',
      type: 'article',
      status: 'published',
      wordCount: 2200,
      seoScore: 97,
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      scheduledAt: null,
      publishedAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: '5',
      title: 'The Shawshank Redemption: Why It\'s Still #1',
      type: 'article',
      status: 'published',
      wordCount: 3000,
      seoScore: 81,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      scheduledAt: null,
      publishedAt: new Date(Date.now() - 432000000).toISOString()
    },
    {
      id: '6',
      title: 'Pulp Fiction: A Deep Dive into Tarantino\'s Masterpiece',
      type: 'article',
      status: 'published',
      wordCount: 3500,
      seoScore: 92,
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      scheduledAt: null,
      publishedAt: new Date(Date.now() - 518400000).toISOString()
    }
  ];

  return mockItems.slice(0, limit);
}