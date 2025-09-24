import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

// Query schema
const querySchema = z.object({
  type: z.enum(['movie', 'tv']).optional(),
  year: z.coerce.number().optional(),
  genre: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
});

// GET /api/admin/titles - List titles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      type: searchParams.get('type'),
      year: searchParams.get('year'),
      genre: searchParams.get('genre'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      search: searchParams.get('search'),
    });

    let queryBuilder = db.ensureClient().from('titles').select('*');
    
    if (query.type) {
      queryBuilder = queryBuilder.eq('type', query.type);
    }
    
    if (query.year) {
      queryBuilder = queryBuilder.gte('release_date', `${query.year}-01-01`);
      queryBuilder = queryBuilder.lte('release_date', `${query.year}-12-31`);
    }
    
    if (query.genre) {
      queryBuilder = queryBuilder.contains('genres', [query.genre]);
    }
    
    if (query.search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query.search}%,original_title.ilike.%${query.search}%`);
    }
    
    const { data: titles, error } = await queryBuilder
      .order('popularity', { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch titles' }, { status: 500 });
    }

    // Get total count
    const { count, error: countError } = await db.ensureClient()
      .from('titles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Failed to get count:', countError);
    }

    return NextResponse.json({
      titles: titles || [],
      total: count || 0,
      limit: query.limit,
      offset: query.offset
    });
  } catch (error) {
    console.error('Titles API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
