import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // all, movies, articles
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        error: 'Search query must be at least 2 characters long'
      }, { status: 400 });
    }

    const searchTerm = query.trim().toLowerCase();
    const results: any = {
      movies: [],
      articles: [],
      total: 0
    };

    // Search movies if type is 'all' or 'movies'
    if (type === 'all' || type === 'movies') {
      const { data: movies, error: moviesError } = await db.ensureClient()
        .from('titles')
        .select(`
          id,
          tmdb_id,
          slug,
          title,
          original_title,
          overview,
          release_date,
          popularity,
          vote_average,
          vote_count,
          genres,
          original_language
        `)
        .eq('type', 'movie')
        .or(`title.ilike.%${searchTerm}%,original_title.ilike.%${searchTerm}%,overview.ilike.%${searchTerm}%`)
        .order('popularity', { ascending: false })
        .limit(limit);

      if (!moviesError && movies) {
        results.movies = movies.map((movie: any) => ({
          id: movie.id,
          type: 'movie',
          title: movie.title,
          year: new Date(movie.release_date).getFullYear(),
          slug: movie.slug,
          overview: movie.overview,
          rating: movie.vote_average,
          popularity: movie.popularity,
          genres: movie.genres,
          url: `/movie/${movie.slug}`
        }));
      }
    }

    // Search articles if type is 'all' or 'articles'
    if (type === 'all' || type === 'articles') {
      const { data: articles, error: articlesError } = await db.ensureClient()
        .from('content_items')
        .select(`
          id,
          slug,
          kind,
          body_md,
          published_at,
          seo_jsonld
        `)
        .eq('status', 'published')
        .or(`body_md.ilike.%${searchTerm}%,seo_jsonld->headline.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (!articlesError && articles) {
        results.articles = articles.map((article: any) => {
          const seoData = typeof article.seo_jsonld === 'string' 
            ? JSON.parse(article.seo_jsonld) 
            : article.seo_jsonld;
          
          return {
            id: article.id,
            type: 'article',
            title: seoData?.headline || article.slug,
            slug: article.slug,
            kind: article.kind,
            excerpt: article.body_md?.substring(0, 150) + '...',
            publishedAt: article.published_at,
            url: `/blog/${article.slug}`
          };
        });
      }
    }

    results.total = results.movies.length + results.articles.length;

    return NextResponse.json({
      query: searchTerm,
      results,
      total: results.total,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

