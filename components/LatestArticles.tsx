"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readTime: number;
  category: string;
  featuredImage?: string;
  author: string;
  tags: string[];
}

export default function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/articles/latest?limit=6');
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
        } else {
          // Fallback to mock data
          setArticles(getMockArticles());
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        // Fallback to mock data
        setArticles(getMockArticles());
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  const getMockArticles = (): Article[] => [
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

  if (loading) {
    return (
      <section className="container py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
          Latest Movie & TV Articles
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Stay updated with our latest insights, reviews, and guides about movies and TV shows. 
          From streaming recommendations to in-depth analysis, we've got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="group">
            <Link href={`/blog/${article.slug}`} className="block">
              <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                {article.featuredImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.log('Article image failed to load:', article.featuredImage)
                        const target = e.target as HTMLImageElement
                        target.src = '/images/fallback/poster.svg'
                      }}
                      onLoad={() => {
                        console.log('Article image loaded successfully:', article.featuredImage)
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#E0B15C] text-[#0A1220] px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                    <span>•</span>
                    <span>{article.author}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#E0B15C] transition-colors line-clamp-2" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-white/10 text-gray-400 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-2xl bg-[var(--gold)] px-8 py-4 text-black font-semibold hover:bg-[var(--gold-soft)] transition-colors"
        >
          View All Articles
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
