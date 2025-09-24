import { db } from './database';

export interface ArticleTopic {
  id: string;
  title: string;
  slug: string;
  category: string;
  targetKeywords: string[];
  longTailKeywords: string[];
  authorityLinks: AuthorityLink[];
  contentOutline: string[];
  seoData: SEOData;
  estimatedWordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
  generatedAt: string;
  status: 'draft' | 'approved' | 'rejected';
}

export interface AuthorityLink {
  title: string;
  url: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  internalLinks: string[];
  externalLinks: string[];
  schemaMarkup: string;
  socialMediaTags: {
    openGraph: {
      title: string;
      description: string;
      image: string;
    };
    twitter: {
      title: string;
      description: string;
      image: string;
    };
  };
}

export class ArticleTopicGenerator {
  private db = db;

  async generateWeeklyTopics(count: number = 7): Promise<ArticleTopic[]> {
    const topics: ArticleTopic[] = [];
    const currentDate = new Date();
    
    // Get trending movies and TV shows for inspiration
    const trendingContent = await this.getTrendingContent();
    
    // Generate diverse content types for maximum SEO impact
    const contentTypes = [
      { type: 'list', subtype: 'best_movies' },
      { type: 'guide', subtype: 'how_to_watch' },
      { type: 'list', subtype: 'romantic_movies' },
      { type: 'seasonal', subtype: 'weekend_movies' },
      { type: 'comparison', subtype: 'platform_comparison' },
      { type: 'trending', subtype: 'viral_content' },
      { type: 'evergreen', subtype: 'classic_movies' }
    ];

    for (let i = 0; i < count; i++) {
      const contentType = contentTypes[i % contentTypes.length];
      const topic = await this.generateUltimateTopic(contentType, trendingContent, i);
      topics.push(topic);
    }

    // Save topics to database
    await this.saveTopics(topics);

    return topics;
  }

  private async getTrendingContent(): Promise<any[]> {
    try {
      const { data } = await this.db.ensureClient()
        .from('titles')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(20);

      return data || [];
    } catch (error) {
      console.error('Failed to fetch trending content:', error);
      return [];
    }
  }

  private async generateUltimateTopic(contentType: any, trendingContent: any[], index: number): Promise<ArticleTopic> {
    const baseTopics = this.getUltimateTopics(contentType, trendingContent);
    const selectedTopic = baseTopics[index % baseTopics.length];
    
    return {
      id: `topic-${Date.now()}-${index}`,
      title: selectedTopic.title,
      slug: this.generateSlug(selectedTopic.title),
      category: selectedTopic.category,
      targetKeywords: selectedTopic.targetKeywords,
      longTailKeywords: selectedTopic.longTailKeywords,
      authorityLinks: await this.generateAuthorityLinks(selectedTopic),
      contentOutline: selectedTopic.contentOutline,
      seoData: this.generateSEOData(selectedTopic),
      estimatedWordCount: selectedTopic.estimatedWordCount,
      difficulty: selectedTopic.difficulty,
      priority: selectedTopic.priority,
      generatedAt: new Date().toISOString(),
      status: 'draft'
    };
  }

  private async generateTopic(type: string, trendingContent: any[], index: number): Promise<ArticleTopic> {
    const baseTopics = this.getBaseTopics(type, trendingContent);
    const selectedTopic = baseTopics[index % baseTopics.length];
    
    return {
      id: `topic-${Date.now()}-${index}`,
      title: selectedTopic.title,
      slug: this.generateSlug(selectedTopic.title),
      category: selectedTopic.category,
      targetKeywords: selectedTopic.targetKeywords,
      longTailKeywords: selectedTopic.longTailKeywords,
      authorityLinks: await this.generateAuthorityLinks(selectedTopic),
      contentOutline: selectedTopic.contentOutline,
      seoData: this.generateSEOData(selectedTopic),
      estimatedWordCount: selectedTopic.estimatedWordCount,
      difficulty: selectedTopic.difficulty,
      priority: selectedTopic.priority,
      generatedAt: new Date().toISOString(),
      status: 'draft'
    };
  }

  private getUltimateTopics(contentType: any, trendingContent: any[]): any[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentDay = new Date().toLocaleString('default', { weekday: 'long' });
    
    const { type, subtype } = contentType;
    
    const ultimateTopics = {
      list: {
        best_movies: [
          {
            title: `The 10 Best Action Movies on Netflix Right Now (${currentYear})`,
            category: 'Movie Lists',
            targetKeywords: ['best action movies netflix', 'netflix action films 2024', 'top action movies streaming'],
            longTailKeywords: [
              'best action movies on netflix right now',
              'top rated action movies netflix 2024',
              'new action movies on netflix this year',
              'netflix action movies with good ratings',
              'best action films to watch on netflix tonight'
            ],
            contentOutline: [
              'Hook: Why action movies dominate streaming',
              'Selection criteria and methodology',
              'Top 10 action movies with detailed reviews',
              'Where to watch each movie',
              'Pro tips for action movie fans',
              'What makes these movies stand out',
              'Conclusion and next recommendations'
            ],
            estimatedWordCount: 2800,
            difficulty: 'medium',
            priority: 'high'
          },
          {
            title: `The Ultimate List: 15 Best Romantic Movies to Watch This ${currentMonth}`,
            category: 'Movie Lists',
            targetKeywords: ['best romantic movies', 'romantic films 2024', 'love movies streaming'],
            longTailKeywords: [
              'best romantic movies to watch this month',
              'top romantic films on streaming platforms',
              'best love stories movies 2024',
              'romantic movies perfect for date night',
              'best romantic comedies and dramas'
            ],
            contentOutline: [
              'Opening: The power of romantic movies',
              'Classic vs modern romantic films',
              'Top 15 romantic movies with reviews',
              'Perfect viewing scenarios',
              'Streaming availability guide',
              'Romantic movie recommendations by mood',
              'Conclusion and romantic movie tips'
            ],
            estimatedWordCount: 3200,
            difficulty: 'medium',
            priority: 'high'
          }
        ]
      },
      guide: {
        how_to_watch: [
          {
            title: `How to Find the Perfect Movie to Watch Tonight: The Complete Guide`,
            category: 'Streaming Guides',
            targetKeywords: ['how to find movies', 'what to watch tonight', 'movie discovery guide'],
            longTailKeywords: [
              'how to find good movies to watch tonight',
              'best way to discover new movies',
              'how to choose what movie to watch',
              'movie recommendation guide for beginners',
              'how to find movies based on mood'
            ],
            contentOutline: [
              'The movie discovery problem',
              'Step-by-step movie finding process',
              'Platform-specific discovery tools',
              'Mood-based movie selection',
              'Genre exploration techniques',
              'Advanced discovery methods',
              'Troubleshooting common issues',
              'Pro tips from movie experts'
            ],
            estimatedWordCount: 2500,
            difficulty: 'easy',
            priority: 'high'
          }
        ]
      },
      seasonal: {
        weekend_movies: [
          {
            title: `Perfect Weekend Movie Marathon: 12 Films for the Ultimate ${currentDay} Night`,
            category: 'Seasonal Content',
            targetKeywords: ['weekend movies', 'movie marathon', 'weekend entertainment'],
            longTailKeywords: [
              'best movies to watch on weekend',
              'perfect weekend movie marathon',
              'weekend movie night ideas',
              'best films for weekend binge watching',
              'weekend movie recommendations by genre'
            ],
            contentOutline: [
              'Why weekend movies matter',
              'Marathon planning essentials',
              '12 carefully curated films',
              'Viewing schedule and breaks',
              'Snack and setup recommendations',
              'Genre variety for all tastes',
              'Weekend movie success tips'
            ],
            estimatedWordCount: 2600,
            difficulty: 'easy',
            priority: 'medium'
          }
        ]
      },
      comparison: {
        platform_comparison: [
          {
            title: `Netflix vs Disney+ vs Prime Video: Which Streaming Service Has the Best Movies in ${currentYear}?`,
            category: 'Streaming Comparison',
            targetKeywords: ['netflix vs disney plus', 'streaming service comparison', 'best streaming platform'],
            longTailKeywords: [
              'netflix vs disney plus vs prime video comparison',
              'which streaming service has best movies',
              'streaming platform movie library comparison',
              'best streaming service for movie lovers',
              'netflix disney plus prime video movie selection'
            ],
            contentOutline: [
              'The streaming wars explained',
              'Methodology and comparison criteria',
              'Netflix movie library analysis',
              'Disney+ movie collection review',
              'Prime Video movie selection',
              'Head-to-head comparisons',
              'Value for money analysis',
              'Final verdict and recommendations'
            ],
            estimatedWordCount: 3000,
            difficulty: 'medium',
            priority: 'high'
          }
        ]
      },
      trending: {
        viral_content: [
          {
            title: `The Movies Everyone's Talking About: Viral Hits and Social Media Sensations of ${currentYear}`,
            category: 'Trending Content',
            targetKeywords: ['viral movies', 'trending films', 'social media movies'],
            longTailKeywords: [
              'movies everyone is talking about right now',
              'viral movie hits 2024',
              'trending movies on social media',
              'movies that went viral this year',
              'social media movie sensations'
            ],
            contentOutline: [
              'The viral movie phenomenon',
              'Social media impact on movie popularity',
              'Top viral movies of the year',
              'Why these movies went viral',
              'Streaming availability of viral hits',
              'Predicting the next viral movies',
              'How to stay updated on trending films'
            ],
            estimatedWordCount: 2400,
            difficulty: 'medium',
            priority: 'high'
          }
        ]
      },
      evergreen: {
        classic_movies: [
          {
            title: `Timeless Classics: 20 Essential Movies Every Film Lover Must Watch`,
            category: 'Educational Content',
            targetKeywords: ['classic movies', 'essential films', 'must watch movies'],
            longTailKeywords: [
              'classic movies everyone should watch',
              'essential films for movie lovers',
              'must watch classic movies list',
              'timeless movies that never get old',
              'best classic films of all time'
            ],
            contentOutline: [
              'Why classic movies matter',
              'What makes a movie timeless',
              '20 essential classic films',
              'Historical context and significance',
              'Where to watch classic movies',
              'How to appreciate classic cinema',
              'Building your classic movie collection'
            ],
            estimatedWordCount: 3500,
            difficulty: 'hard',
            priority: 'medium'
          }
        ]
      }
    };

    return (ultimateTopics as any)[type]?.[subtype] || [];
  }

  private getBaseTopics(type: string, trendingContent: any[]): any[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    const baseTopics = {
      top_lists: [
        {
          title: `Top 10 Action Movies on Netflix in ${currentYear}`,
          category: 'Movie Lists',
          targetKeywords: ['action movies netflix', 'best action movies 2024', 'netflix action films'],
          longTailKeywords: [
            'best action movies on netflix right now',
            'top rated action movies netflix 2024',
            'new action movies on netflix this year',
            'netflix action movies with good ratings'
          ],
          contentOutline: [
            'Introduction to action movies on Netflix',
            'Criteria for selection',
            'Top 10 movies with detailed reviews',
            'Where to watch each movie',
            'Conclusion and recommendations'
          ],
          estimatedWordCount: 2500,
          difficulty: 'medium',
          priority: 'high'
        },
        {
          title: `Best Drama TV Shows on Prime Video ${currentYear}`,
          category: 'TV Lists',
          targetKeywords: ['drama tv shows prime video', 'best drama series 2024', 'prime video dramas'],
          longTailKeywords: [
            'best drama tv shows on amazon prime video',
            'top rated drama series prime video 2024',
            'new drama shows on prime video this year',
            'prime video original drama series'
          ],
          contentOutline: [
            'Introduction to drama series on Prime Video',
            'Selection criteria',
            'Top 10 drama shows with reviews',
            'Streaming availability',
            'Conclusion and viewer recommendations'
          ],
          estimatedWordCount: 2200,
          difficulty: 'medium',
          priority: 'high'
        }
      ],
      how_to_guides: [
        {
          title: `How to Watch ${trendingContent[0]?.title || 'Popular Movies'} on All Streaming Platforms`,
          category: 'Streaming Guides',
          targetKeywords: ['how to watch movies', 'streaming platforms guide', 'where to watch films'],
          longTailKeywords: [
            'how to watch movies on all streaming services',
            'complete guide to streaming platforms',
            'where to find movies online legally',
            'streaming platform comparison guide'
          ],
          contentOutline: [
            'Introduction to streaming platforms',
            'Platform-by-platform guide',
            'Cost comparison',
            'Content availability',
            'Tips for finding specific movies'
          ],
          estimatedWordCount: 2000,
          difficulty: 'easy',
          priority: 'medium'
        }
      ],
      comparisons: [
        {
          title: 'Netflix vs Disney+ vs Prime Video: Which Streaming Service is Best for Families?',
          category: 'Streaming Comparison',
          targetKeywords: ['netflix vs disney plus', 'streaming service comparison', 'family streaming'],
          longTailKeywords: [
            'best streaming service for families with kids',
            'netflix disney plus prime video comparison',
            'family friendly streaming platforms 2024',
            'which streaming service has best kids content'
          ],
          contentOutline: [
            'Introduction to family streaming needs',
            'Service-by-service analysis',
            'Content comparison',
            'Pricing and value',
            'Final recommendation'
          ],
          estimatedWordCount: 2800,
          difficulty: 'medium',
          priority: 'high'
        }
      ],
      reviews: [
        {
          title: `${trendingContent[1]?.title || 'Popular Movie'} Review: Is It Worth Watching?`,
          category: 'Movie Reviews',
          targetKeywords: [`${trendingContent[1]?.title?.toLowerCase()} review`, 'movie review 2024', 'worth watching'],
          longTailKeywords: [
            `is ${trendingContent[1]?.title} worth watching`,
            `${trendingContent[1]?.title} movie review and rating`,
            `should i watch ${trendingContent[1]?.title}`,
            `${trendingContent[1]?.title} streaming review`
          ],
          contentOutline: [
            'Movie overview and plot summary',
            'Cast and crew analysis',
            'What works and what doesn\'t',
            'Target audience',
            'Final verdict and rating'
          ],
          estimatedWordCount: 1800,
          difficulty: 'easy',
          priority: 'medium'
        }
      ],
      analysis: [
        {
          title: 'Why Superhero Movies Are Still Dominating the Box Office in 2024',
          category: 'Movie Analysis',
          targetKeywords: ['superhero movies 2024', 'box office analysis', 'movie industry trends'],
          longTailKeywords: [
            'why superhero movies are still popular',
            'superhero movie box office performance 2024',
            'future of superhero films in cinema',
            'superhero movie trends and analysis'
          ],
          contentOutline: [
            'Historical context of superhero movies',
            'Current box office performance',
            'Factors driving continued success',
            'Criticisms and challenges',
            'Future predictions'
          ],
          estimatedWordCount: 3000,
          difficulty: 'hard',
          priority: 'medium'
        }
      ],
      seasonal: [
        {
          title: `Best ${currentMonth} Movies to Watch This Season`,
          category: 'Seasonal Content',
          targetKeywords: [`${currentMonth.toLowerCase()} movies`, 'seasonal films', 'monthly movie recommendations'],
          longTailKeywords: [
            `best movies to watch in ${currentMonth}`,
            `${currentMonth} movie recommendations 2024`,
            `seasonal movies for ${currentMonth}`,
            `what to watch this ${currentMonth}`
          ],
          contentOutline: [
            `Introduction to ${currentMonth} movie watching`,
            'Curated movie selection',
            'Genre variety and options',
            'Streaming availability',
            'Conclusion and seasonal tips'
          ],
          estimatedWordCount: 2000,
          difficulty: 'easy',
          priority: 'medium'
        }
      ],
      trending: [
        {
          title: `What's Trending: ${trendingContent[2]?.title || 'Popular Content'} and Why Everyone's Talking About It`,
          category: 'Trending Content',
          targetKeywords: ['trending movies', 'popular films 2024', 'viral content'],
          longTailKeywords: [
            'what movies are trending right now',
            'most talked about films 2024',
            'viral movie content this week',
            'trending movies everyone is watching'
          ],
          contentOutline: [
            'Introduction to trending content',
            'Analysis of current trends',
            'Why it\'s popular',
            'Social media impact',
            'Future trend predictions'
          ],
          estimatedWordCount: 2200,
          difficulty: 'medium',
          priority: 'high'
        }
      ],
      evergreen: [
        {
          title: 'The Complete Guide to Movie Genres: From Action to Zombie Films',
          category: 'Educational Content',
          targetKeywords: ['movie genres guide', 'film genres explained', 'types of movies'],
          longTailKeywords: [
            'complete guide to movie genres',
            'all movie genres explained',
            'types of films and their characteristics',
            'movie genre definitions and examples'
          ],
          contentOutline: [
            'Introduction to movie genres',
            'Major genre categories',
            'Sub-genres and variations',
            'Genre evolution over time',
            'How to identify genres'
          ],
          estimatedWordCount: 3500,
          difficulty: 'hard',
          priority: 'low'
        }
      ]
    };

    return baseTopics[type as keyof typeof baseTopics] || [];
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async generateAuthorityLinks(topic: any): Promise<AuthorityLink[]> {
    // In a real implementation, you'd use APIs to find relevant authority links
    // For now, we'll return mock data
    return [
      {
        title: 'IMDb - Internet Movie Database',
        url: 'https://www.imdb.com',
        description: 'Comprehensive movie and TV show database with ratings and reviews',
        relevance: 'high'
      },
      {
        title: 'Rotten Tomatoes',
        url: 'https://www.rottentomatoes.com',
        description: 'Movie and TV show reviews and ratings from critics and audiences',
        relevance: 'high'
      },
      {
        title: 'The Movie Database (TMDB)',
        url: 'https://www.themoviedb.org',
        description: 'Community-driven movie and TV database with comprehensive information',
        relevance: 'high'
      },
      {
        title: 'Netflix Official Site',
        url: 'https://www.netflix.com',
        description: 'Official Netflix streaming platform with current content library',
        relevance: 'medium'
      }
    ];
  }

  private generateSEOData(topic: any): SEOData {
    return {
      metaTitle: `${topic.title} | YallaCinema - Your Ultimate Movie Guide`,
      metaDescription: `Discover ${topic.title.toLowerCase()}. Get expert recommendations, reviews, and streaming guides for the best movies and TV shows.`,
      focusKeyword: topic.targetKeywords[0],
      secondaryKeywords: topic.targetKeywords.slice(1),
      internalLinks: [
        '/blog',
        '/what-to-watch/tonight',
        '/top-10-movies',
        '/streaming-guides'
      ],
      externalLinks: [
        'https://www.imdb.com',
        'https://www.rottentomatoes.com',
        'https://www.netflix.com'
      ],
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": topic.title,
        "description": `Discover ${topic.title.toLowerCase()}. Get expert recommendations, reviews, and streaming guides.`,
        "author": {
          "@type": "Organization",
          "name": "YallaCinema"
        },
        "publisher": {
          "@type": "Organization",
          "name": "YallaCinema"
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString()
      }),
      socialMediaTags: {
        openGraph: {
          title: topic.title,
          description: `Discover ${topic.title.toLowerCase()}. Get expert recommendations, reviews, and streaming guides.`,
          image: 'https://yallacinema.com/og-image.jpg'
        },
        twitter: {
          title: topic.title,
          description: `Discover ${topic.title.toLowerCase()}. Get expert recommendations, reviews, and streaming guides.`,
          image: 'https://yallacinema.com/twitter-image.jpg'
        }
      }
    };
  }

  private async saveTopics(topics: ArticleTopic[]): Promise<void> {
    try {
      const { error } = await this.db.ensureClient()
        .from('article_topics')
        .insert(topics.map(topic => ({
          id: topic.id,
          title: topic.title,
          slug: topic.slug,
          category: topic.category,
          target_keywords: topic.targetKeywords,
          long_tail_keywords: topic.longTailKeywords,
          authority_links: topic.authorityLinks,
          content_outline: topic.contentOutline,
          seo_data: topic.seoData,
          estimated_word_count: topic.estimatedWordCount,
          difficulty: topic.difficulty,
          priority: topic.priority,
          generated_at: topic.generatedAt,
          status: topic.status
        })));

      if (error) {
        console.error('Failed to save article topics:', error);
      }
    } catch (error) {
      console.error('Error saving article topics:', error);
    }
  }

  async getTopics(status?: string, limit: number = 50): Promise<ArticleTopic[]> {
    try {
      let query = this.db.ensureClient()
        .from('article_topics')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch article topics:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        targetKeywords: row.target_keywords,
        longTailKeywords: row.long_tail_keywords,
        authorityLinks: row.authority_links,
        contentOutline: row.content_outline,
        seoData: row.seo_data,
        estimatedWordCount: row.estimated_word_count,
        difficulty: row.difficulty,
        priority: row.priority,
        generatedAt: row.generated_at,
        status: row.status
      }));

    } catch (error) {
      console.error('Error fetching article topics:', error);
      return [];
    }
  }

  async updateTopicStatus(id: string, status: 'draft' | 'approved' | 'rejected'): Promise<void> {
    try {
      const { error } = await this.db.ensureClient()
        .from('article_topics')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Failed to update topic status:', error);
      }
    } catch (error) {
      console.error('Error updating topic status:', error);
    }
  }
}
