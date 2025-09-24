import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

// Query schema
const querySchema = z.object({
  country: z.enum(['US', 'CA']).default('US'),
});

// GET /api/factsheets/[type]/[tmdbId] - Get factsheet
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; tmdbId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      country: searchParams.get('country') as 'US' | 'CA' || 'US',
    });

    // Get title by TMDB ID
    const { data: title, error: titleError } = await db.ensureClient()
      .from('titles')
      .select('*')
      .eq('tmdb_id', parseInt(params.tmdbId))
      .eq('type', params.type)
      .single();

    if (titleError || !title) {
      return NextResponse.json({ error: 'Title not found' }, { status: 404 });
    }

    // Get factsheet
    const { data: factsheet, error: factsheetError } = await db.ensureClient()
      .from('factsheets')
      .select('*')
      .eq('title_id', title.id)
      .single();

    if (factsheetError || !factsheet) {
      return NextResponse.json({ error: 'Factsheet not found' }, { status: 404 });
    }

    // Get watch providers for the country
    const { data: providers, error: providersError } = await db.ensureClient()
      .from('watch_providers')
      .select('*')
      .eq('title_id', title.id)
      .eq('country', query.country)
      .single();

    // Get images
    const { data: images, error: imagesError } = await db.ensureClient()
      .from('images')
      .select('*')
      .eq('title_id', title.id)
      .order('vote_average', { ascending: false });

    // Get videos
    const { data: videos, error: videosError } = await db.ensureClient()
      .from('videos')
      .select('*')
      .eq('title_id', title.id)
      .eq('type', 'Trailer')
      .order('published_at', { ascending: false });

    // Get cast and crew
    const { data: credits, error: creditsError } = await db.ensureClient()
      .from('credits_people')
      .select(`
        *,
        people:person_id (
          id,
          name,
          profile_path,
          character,
          job,
          department
        )
      `)
      .eq('title_id', title.id)
      .order('order_index', { ascending: true });

    // Build response
    const response = {
      ...factsheet.curated_data,
      title: title.title,
      original_title: title.original_title,
      overview: title.overview,
      release_date: title.release_date || title.first_air_date,
      runtime: title.runtime,
      genres: title.genres,
      rating: title.vote_average,
      vote_count: title.vote_count,
      popularity: title.popularity,
      type: title.type,
      slug: title.slug,
      country: query.country,
      providers: providers ? {
        flatrate: providers.flatrate,
        rent: providers.rent,
        buy: providers.buy,
        link: providers.link
      } : null,
      images: images || [],
      videos: videos || [],
      cast: credits?.filter((c: any) => c.character) || [],
      crew: credits?.filter((c: any) => c.job) || [],
      last_updated: factsheet.last_verified_at
    };

    // Set cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    headers.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify(response), { headers });
  } catch (error) {
    console.error('Factsheet API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
