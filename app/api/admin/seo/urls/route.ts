import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, movies, articles, pages
    const limit = parseInt(searchParams.get('limit') || '50');

    const urls: any[] = [];

    // Get movie URLs
    if (type === 'all' || type === 'movies') {
      const { data: movies, error: moviesError } = await db.ensureClient()
        .from('titles')
        .select('id, slug, title, type, popularity, vote_average')
        .eq('type', 'movie')
        .order('popularity', { ascending: false })
        .limit(limit);

      if (!moviesError && movies) {
        movies.forEach(movie => {
          urls.push({
            id: movie.id,
            type: 'movie',
            title: movie.title,
            url: `/movie/${movie.slug}`,
            slug: movie.slug,
            popularity: movie.popularity,
            rating: movie.vote_average,
            lastUpdated: new Date().toISOString(),
            backlinks: 0, // This would be calculated from actual backlink data
            seoScore: Math.round((movie.vote_average || 0) * 10), // Mock SEO score
            status: 'published'
          });
        });
      }
    }

    // Get article URLs
    if (type === 'all' || type === 'articles') {
      const { data: articles, error: articlesError } = await db.ensureClient()
        .from('content_items')
        .select('id, slug, kind, published_at, seo_jsonld')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (!articlesError && articles) {
        articles.forEach(article => {
          const seoData = typeof article.seo_jsonld === 'string' 
            ? JSON.parse(article.seo_jsonld) 
            : article.seo_jsonld;
          
          urls.push({
            id: article.id,
            type: 'article',
            title: seoData?.headline || article.slug,
            url: `/blog/${article.slug}`,
            slug: article.slug,
            kind: article.kind,
            publishedAt: article.published_at,
            lastUpdated: article.published_at,
            backlinks: 0, // This would be calculated from actual backlink data
            seoScore: 85, // Mock SEO score for articles
            status: 'published'
          });
        });
      }
    }

    // Get static page URLs
    if (type === 'all' || type === 'pages') {
      const staticPages = [
        {
          id: 'home',
          type: 'page',
          title: 'Homepage',
          url: '/',
          slug: 'home',
          lastUpdated: new Date().toISOString(),
          backlinks: 0,
          seoScore: 95,
          status: 'published'
        },
        {
          id: 'movies',
          type: 'page',
          title: 'Movies',
          url: '/movies',
          slug: 'movies',
          lastUpdated: new Date().toISOString(),
          backlinks: 0,
          seoScore: 90,
          status: 'published'
        },
        {
          id: 'blog',
          type: 'page',
          title: 'Blog',
          url: '/blog',
          slug: 'blog',
          lastUpdated: new Date().toISOString(),
          backlinks: 0,
          seoScore: 88,
          status: 'published'
        },
        {
          id: 'privacy',
          type: 'page',
          title: 'Privacy Policy',
          url: '/privacy',
          slug: 'privacy',
          lastUpdated: new Date().toISOString(),
          backlinks: 0,
          seoScore: 70,
          status: 'published'
        },
        {
          id: 'contact',
          type: 'page',
          title: 'Contact Us',
          url: '/contact',
          slug: 'contact',
          lastUpdated: new Date().toISOString(),
          backlinks: 0,
          seoScore: 75,
          status: 'published'
        }
      ];

      urls.push(...staticPages);
    }

    // Sort by SEO score and popularity
    urls.sort((a, b) => {
      if (a.seoScore !== b.seoScore) {
        return b.seoScore - a.seoScore;
      }
      return (b.popularity || 0) - (a.popularity || 0);
    });

    return NextResponse.json({
      urls,
      total: urls.length,
      summary: {
        movies: urls.filter(u => u.type === 'movie').length,
        articles: urls.filter(u => u.type === 'article').length,
        pages: urls.filter(u => u.type === 'page').length,
        averageSeoScore: Math.round(urls.reduce((sum, u) => sum + u.seoScore, 0) / urls.length),
        totalBacklinks: urls.reduce((sum, u) => sum + u.backlinks, 0)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching SEO URLs:', error);
    return NextResponse.json({
      error: 'Failed to fetch SEO URLs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

