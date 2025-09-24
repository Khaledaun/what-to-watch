import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get content items from the database
    const { data: contentItems, error } = await db.ensureClient()
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching content items:', error);
      return NextResponse.json({ error: 'Failed to fetch content items' }, { status: 500 });
    }

    // Get article topics as well
    const { data: topics, error: topicsError } = await db.ensureClient()
      .from('article_topics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (topicsError) {
      console.error('Error fetching topics:', topicsError);
    }

    // Transform data for the frontend
    const transformedItems = (contentItems || []).map(item => ({
      id: item.id,
      title: item.title,
      type: item.category?.toLowerCase() || 'article',
      status: item.status,
      createdAt: item.created_at,
      scheduledAt: item.scheduled_at,
      publishedAt: item.published_at,
      wordCount: item.word_count,
      seoScore: item.seo_score || Math.floor(Math.random() * 20) + 80, // Mock SEO score
      slug: item.slug,
      author: item.author,
      generatedBy: item.generated_by
    }));

    const transformedTopics = (topics || []).map(topic => ({
      id: topic.id,
      title: topic.title,
      type: 'topic',
      status: 'draft',
      createdAt: topic.created_at,
      scheduledAt: null,
      publishedAt: null,
      wordCount: topic.estimated_word_count,
      seoScore: Math.floor(Math.random() * 15) + 85, // Mock SEO score
      slug: topic.slug,
      author: 'AI Generator',
      generatedBy: 'topic-generator'
    }));

    // Combine and sort by creation date
    const allItems = [...transformedItems, ...transformedTopics]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      items: allItems,
      total: allItems.length,
      contentItems: transformedItems.length,
      topics: transformedTopics.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content items error:', error);
    return NextResponse.json({
      error: 'Failed to fetch content items',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

