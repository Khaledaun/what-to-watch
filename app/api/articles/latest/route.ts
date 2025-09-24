import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

// Query schema
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(20).default(6),
  category: z.string().optional(),
});

// GET /api/articles/latest - Get latest published articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      limit: searchParams.get('limit'),
      category: searchParams.get('category'),
    });

    let queryBuilder = db.ensureClient()
      .from('content_items')
      .select(`
        id,
        title,
        slug,
        excerpt,
        published_at,
        read_time,
        category,
        featured_image,
        author,
        tags,
        status
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(query.limit);

    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }

    const { data: articles, error } = await queryBuilder;

    if (error) {
      console.error('Failed to fetch articles:', error);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedArticles = (articles || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      publishedAt: article.published_at,
      readTime: article.read_time,
      category: article.category,
      featuredImage: article.featured_image,
      author: article.author,
      tags: article.tags || []
    }));

    return NextResponse.json({
      articles: transformedArticles,
      total: transformedArticles.length
    });

  } catch (error) {
    console.error('Articles API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
