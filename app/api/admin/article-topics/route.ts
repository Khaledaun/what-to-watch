import { NextRequest, NextResponse } from 'next/server';
import { ArticleTopicGenerator } from '@/lib/article-generator';
import { z } from 'zod';

// Query schema
const querySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
});

// GET /api/admin/article-topics - Get article topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      status: searchParams.get('status'),
      limit: searchParams.get('limit'),
    });

    const generator = new ArticleTopicGenerator();
    const topics = await generator.getTopics(query.status, query.limit);

    return NextResponse.json({
      topics,
      total: topics.length
    });

  } catch (error) {
    console.error('Article topics API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/article-topics - Generate new topics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 10 } = body;

    const generator = new ArticleTopicGenerator();
    const topics = await generator.generateWeeklyTopics(count);

    return NextResponse.json({
      message: 'Topics generated successfully',
      topics,
      count: topics.length
    });

  } catch (error) {
    console.error('Article topics generation error:', error);
    return NextResponse.json({ error: 'Failed to generate topics' }, { status: 500 });
  }
}
