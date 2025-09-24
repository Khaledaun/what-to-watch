import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const client = db.ensureClient();
    let articles = [];

    if (client) {
      let query = client.from('content_items').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Database error:', error);
      } else {
        articles = data || [];
      }
    }

    // If no articles from database, use mock data
    if (articles.length === 0) {
      articles = getMockArticles(limit);
    }

    return NextResponse.json({
      articles,
      total: articles.length,
      limit
    });

  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, status = 'draft' } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const client = db.ensureClient();
    
    if (!client) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'Cannot save article without database connection'
      }, { status: 503 });
    }

    const article = {
      title,
      content,
      category: category || 'general',
      status,
      slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      excerpt: content.substring(0, 200) + '...',
      word_count: content.split(' ').length,
      read_time: Math.ceil(content.split(' ').length / 200),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('content_items')
      .insert([article])
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      article: data
    });

  } catch (error) {
    console.error('Create article API error:', error);
    return NextResponse.json({
      error: 'Failed to create article',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getMockArticles(limit: number) {
  return [
    {
      id: '1',
      title: 'Top 10 Action Movies on Netflix 2024',
      content: 'Discover the best action movies currently streaming on Netflix...',
      excerpt: 'From explosive blockbusters to intense thrillers, here are the top action movies you can watch right now.',
      slug: 'top-10-action-movies-netflix-2024',
      category: 'movies',
      status: 'published',
      word_count: 2500,
      read_time: 12,
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'How to Watch Popular Movies on All Platforms',
      content: 'Find out where to watch the most popular movies across different streaming services...',
      excerpt: 'Complete guide to finding and watching popular movies on Netflix, Prime Video, Disney+, and more.',
      slug: 'how-to-watch-popular-movies-all-platforms',
      category: 'streaming',
      status: 'published',
      word_count: 2000,
      read_time: 10,
      created_at: '2024-01-19T15:30:00Z',
      updated_at: '2024-01-19T15:30:00Z'
    },
    {
      id: '3',
      title: 'Netflix vs Disney+ vs Prime Video Comparison',
      content: 'Compare the top streaming services to find the best one for your needs...',
      excerpt: 'Detailed comparison of Netflix, Disney+, and Prime Video including content, pricing, and features.',
      slug: 'netflix-vs-disney-plus-vs-prime-video-comparison',
      category: 'streaming',
      status: 'draft',
      word_count: 2800,
      read_time: 14,
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-18T09:15:00Z'
    }
  ].slice(0, limit);
}