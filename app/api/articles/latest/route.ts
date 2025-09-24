import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

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

    const client = db.ensureClient();
    let articles = [];

    if (client) {
      try {
        let queryBuilder = client
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

        const { data, error } = await queryBuilder;

        if (error) {
          console.error('Database error:', error);
        } else {
          articles = data || [];
        }
      } catch (dbError) {
        console.error('Database query error:', dbError);
      }
    }

    // If no articles from database, use fallback data
    if (articles.length === 0) {
      articles = getMockArticles(query.limit);
    }

    // Transform the data to match the expected format
    const transformedArticles = articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      publishedAt: article.published_at || article.publishedAt,
      readTime: article.read_time || article.readTime,
      category: article.category,
      featuredImage: article.featured_image || article.featuredImage,
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

    // Return fallback data on error
    const fallbackArticles = getMockArticles(6);
    return NextResponse.json({
      articles: fallbackArticles,
      total: fallbackArticles.length,
      error: 'Using fallback data'
    });
  }
}

function getMockArticles(limit: number) {
  const mockArticles = [
    {
      id: "1",
      title: "Top 10 Action Movies to Watch on Netflix in 2024",
      slug: "top-10-action-movies-netflix-2024",
      excerpt: "Discover the best action movies available on Netflix right now. From classic blockbusters to hidden gems, these films will keep you on the edge of your seat.",
      publishedAt: "2024-01-15T10:00:00Z",
      readTime: 8,
      category: "Movie Lists",
      featuredImage: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      author: "YallaCinema Team",
      tags: ["action", "netflix", "movies", "2024"]
    },
    {
      id: "2",
      title: "How to Watch Fight Club: Complete Streaming Guide",
      slug: "how-to-watch-fight-club-streaming-guide",
      excerpt: "Find out where to stream Fight Club, the cult classic that redefined modern cinema. Our complete guide covers all streaming platforms and viewing options.",
      publishedAt: "2024-01-14T15:30:00Z",
      readTime: 5,
      category: "Streaming Guides",
      featuredImage: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      author: "YallaCinema Team",
      tags: ["fight club", "streaming", "guide", "drama"]
    },
    {
      id: "3",
      title: "Best Drama Movies on Prime Video: Hidden Gems You Need to See",
      slug: "best-drama-movies-prime-video-hidden-gems",
      excerpt: "Explore the most compelling drama movies on Prime Video that you might have missed. These hidden gems offer powerful storytelling and unforgettable performances.",
      publishedAt: "2024-01-13T12:00:00Z",
      readTime: 7,
      category: "Movie Reviews",
      featuredImage: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      author: "YallaCinema Team",
      tags: ["drama", "prime video", "hidden gems", "movies"]
    },
    {
      id: "4",
      title: "The Shawshank Redemption: Why It's Still the #1 Movie of All Time",
      slug: "shawshank-redemption-number-one-movie-all-time",
      excerpt: "Dive deep into why The Shawshank Redemption continues to top movie lists worldwide. We analyze the themes, performances, and timeless appeal of this masterpiece.",
      publishedAt: "2024-01-12T09:15:00Z",
      readTime: 10,
      category: "Movie Analysis",
      featuredImage: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      author: "YallaCinema Team",
      tags: ["shawshank redemption", "classic", "analysis", "drama"]
    },
    {
      id: "5",
      title: "Netflix vs Prime Video: Which Streaming Service Has Better Movies?",
      slug: "netflix-vs-prime-video-better-movies-comparison",
      excerpt: "Compare Netflix and Prime Video's movie libraries to find out which service offers better value for movie lovers. We break down the pros and cons of each platform.",
      publishedAt: "2024-01-11T14:45:00Z",
      readTime: 6,
      category: "Streaming Comparison",
      featuredImage: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      author: "YallaCinema Team",
      tags: ["netflix", "prime video", "comparison", "streaming"]
    },
    {
      id: "6",
      title: "Pulp Fiction: A Deep Dive into Tarantino's Masterpiece",
      slug: "pulp-fiction-tarantino-masterpiece-deep-dive",
      excerpt: "Explore the intricate storytelling, memorable characters, and cultural impact of Pulp Fiction. This comprehensive analysis reveals why it remains a cinematic landmark.",
      publishedAt: "2024-01-10T11:20:00Z",
      readTime: 12,
      category: "Movie Analysis",
      featuredImage: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      author: "YallaCinema Team",
      tags: ["pulp fiction", "tarantino", "analysis", "classic"]
    }
  ];

  return mockArticles.slice(0, limit);
}
