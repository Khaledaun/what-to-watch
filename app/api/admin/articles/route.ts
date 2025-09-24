import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

// Article schema
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  author: z.string().default('YallaCinema Team'),
  readTime: z.number().default(0),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  publishDate: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  secondaryKeywords: z.array(z.string()).default([]),
});

// Query schema
const querySchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

// GET /api/admin/articles - List articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      status: searchParams.get('status'),
      category: searchParams.get('category'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    let queryBuilder = db.ensureClient()
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }

    const { data: articles, error } = await queryBuilder;

    if (error) {
      console.error('Failed to fetch articles:', error);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }

    // Get total count
    const { count, error: countError } = await db.ensureClient()
      .from('content_items')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Failed to get count:', countError);
    }

    return NextResponse.json({
      articles: articles || [],
      total: count || 0,
      limit: query.limit,
      offset: query.offset
    });

  } catch (error) {
    console.error('Articles API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/articles - Create article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articleData = articleSchema.parse(body);

    // Calculate word count and reading time
    const wordCount = articleData.content.split(' ').length;
    const readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

    // Prepare article for database
    const article = {
      title: articleData.title,
      slug: articleData.slug,
      content: articleData.content,
      excerpt: articleData.excerpt || articleData.content.substring(0, 200) + '...',
      category: articleData.category,
      tags: articleData.tags,
      featured_image: articleData.featuredImage,
      author: articleData.author,
      read_time: readTime,
      word_count: wordCount,
      status: articleData.status,
      published_at: articleData.status === 'published' ? new Date().toISOString() : null,
      scheduled_at: articleData.status === 'scheduled' && articleData.publishDate ? articleData.publishDate : null,
      seo_title: articleData.seoTitle || articleData.title,
      seo_description: articleData.seoDescription,
      focus_keyword: articleData.focusKeyword,
      secondary_keywords: articleData.secondaryKeywords,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await db.ensureClient()
      .from('content_items')
      .insert(article)
      .select()
      .single();

    if (error) {
      console.error('Failed to create article:', error);
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Article created successfully',
      article: data
    });

  } catch (error) {
    console.error('Article creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid article data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
