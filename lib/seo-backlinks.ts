import { db } from './database';

export interface Backlink {
  url: string;
  title: string;
  description: string;
  type: 'internal' | 'external';
  category: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  backlinks: Backlink[];
  structuredData?: any;
}

export class SEOBacklinkManager {
  private db = db;

  async getBacklinksForPage(pageType: string, pageSlug?: string): Promise<Backlink[]> {
    const backlinks: Backlink[] = [];

    try {
      // Get popular movies for backlinks
      const { data: popularMovies, error: moviesError } = await this.db.ensureClient()
        .from('titles')
        .select('slug, title, overview')
        .eq('type', 'movie')
        .order('popularity', { ascending: false })
        .limit(10);

      if (!moviesError && popularMovies) {
        popularMovies.forEach((movie: any) => {
          if (movie.slug !== pageSlug) { // Don't link to self
            backlinks.push({
              url: `/movie/${movie.slug}`,
              title: movie.title,
              description: movie.overview?.substring(0, 100) + '...' || `Watch ${movie.title} online`,
              type: 'internal',
              category: 'movies'
            });
          }
        });
      }

      // Get published blog posts
      const { data: blogPosts, error: blogError } = await this.db.ensureClient()
        .from('content_items')
        .select('slug, title, description')
        .eq('status', 'published')
        .limit(5);

      if (!blogError && blogPosts) {
        blogPosts.forEach((post: any) => {
          if (post.slug !== pageSlug) {
            backlinks.push({
              url: `/blog/${post.slug}`,
              title: post.title,
              description: post.description?.substring(0, 100) + '...' || `Read about ${post.title}`,
              type: 'internal',
              category: 'blog'
            });
          }
        });
      }

      // Add category pages
      backlinks.push({
        url: '/movies',
        title: 'Browse All Movies',
        description: 'Discover our comprehensive collection of movies with reviews, ratings, and streaming information.',
        type: 'internal',
        category: 'navigation'
      });

      backlinks.push({
        url: '/what-to-watch/tonight',
        title: 'What to Watch Tonight',
        description: 'Get personalized movie and TV show recommendations for tonight based on your mood and preferences.',
        type: 'internal',
        category: 'recommendations'
      });

      backlinks.push({
        url: '/search',
        title: 'Search Movies',
        description: 'Find specific movies and TV shows using our advanced search functionality.',
        type: 'internal',
        category: 'search'
      });

      // Add platform-specific pages
      const platforms = [
        { name: 'Netflix', slug: 'netflix' },
        { name: 'Prime Video', slug: 'prime-video' },
        { name: 'Disney+', slug: 'disney-plus' },
        { name: 'Hulu', slug: 'hulu' },
        { name: 'Max', slug: 'max' },
        { name: 'Apple TV+', slug: 'apple-tv-plus' }
      ];

      platforms.forEach(platform => {
        backlinks.push({
          url: `/what-to-watch/on-${platform.slug}`,
          title: `${platform.name} Movies`,
          description: `Discover the best movies available on ${platform.name} with our curated recommendations.`,
          type: 'internal',
          category: 'platforms'
        });
      });

      // Add genre pages
      const genres = [
        { name: 'Action Movies', slug: 'action' },
        { name: 'Comedy Movies', slug: 'comedy' },
        { name: 'Drama Movies', slug: 'drama' },
        { name: 'Horror Movies', slug: 'horror' },
        { name: 'Romance Movies', slug: 'romance' },
        { name: 'Sci-Fi Movies', slug: 'sci-fi' }
      ];

      genres.forEach(genre => {
        backlinks.push({
          url: `/movies/genre/${genre.slug}`,
          title: genre.name,
          description: `Explore our collection of ${genre.name.toLowerCase()} with reviews and streaming information.`,
          type: 'internal',
          category: 'genres'
        });
      });

      // Shuffle and return 3 random backlinks
      return this.shuffleArray(backlinks).slice(0, 3);

    } catch (error) {
      console.error('Error generating backlinks:', error);
      return backlinks.slice(0, 3); // Return default backlinks
    }
  }

  async generateSEOData(pageType: string, pageData: any): Promise<SEOData> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whattowatch.com';
    
    let title = '';
    let description = '';
    let keywords: string[] = [];
    let canonical = '';

    switch (pageType) {
      case 'movie':
        const year = new Date(pageData.release_date).getFullYear();
        title = `${pageData.title} (${year}) - Movie Review & Where to Watch | What to Watch Tonight`;
        description = `${pageData.overview || `Watch ${pageData.title}, a ${year} movie.`} Find where to stream ${pageData.title} on Netflix, Prime Video, Disney+, Hulu, Max, and Apple TV+. Read our review, see ratings, and discover similar movies.`;
        keywords = [
          pageData.title,
          `${pageData.title} movie`,
          `${pageData.title} review`,
          `watch ${pageData.title}`,
          `${pageData.title} streaming`,
          `${pageData.title} Netflix`,
          `${pageData.title} Prime Video`,
          `${pageData.title} Disney+`,
          `${pageData.title} Hulu`,
          `${pageData.title} Max`,
          `${pageData.title} Apple TV+`,
          `${year} movies`,
          'movie reviews',
          'streaming movies',
          'where to watch movies'
        ];
        canonical = `${baseUrl}/movie/${pageData.slug}`;
        break;

      case 'movies':
        title = 'Movies - Browse All Movies | What to Watch Tonight';
        description = 'Browse our comprehensive collection of movies. Find the best movies to watch on Netflix, Prime Video, Disney+, Hulu, Max, and Apple TV+. Read reviews, see ratings, and discover your next favorite film.';
        keywords = [
          'movies',
          'film collection',
          'movie reviews',
          'streaming movies',
          'Netflix movies',
          'Prime Video movies',
          'Disney+ movies',
          'Hulu movies',
          'Max movies',
          'Apple TV+ movies',
          'movie ratings',
          'movie recommendations',
          'browse movies',
          'watch movies online'
        ];
        canonical = `${baseUrl}/movies`;
        break;

      case 'search':
        title = 'Search Movies | What to Watch Tonight';
        description = 'Search for movies and TV shows. Find the perfect film to watch tonight with our comprehensive search. Browse by title, genre, year, rating, and more.';
        keywords = [
          'search movies',
          'find movies',
          'movie search',
          'film search',
          'search TV shows',
          'movie finder',
          'film finder',
          'movie database',
          'search by genre',
          'search by year',
          'movie recommendations'
        ];
        canonical = `${baseUrl}/search`;
        break;

      case 'home':
        title = 'What to Watch Tonight - Movie & TV Recommendations';
        description = 'Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available. Find the perfect show to watch tonight.';
        keywords = [
          'what to watch tonight',
          'movie recommendations',
          'TV show recommendations',
          'streaming recommendations',
          'Netflix recommendations',
          'Prime Video recommendations',
          'Disney+ recommendations',
          'Hulu recommendations',
          'Max recommendations',
          'Apple TV+ recommendations',
          'movie finder',
          'TV show finder'
        ];
        canonical = `${baseUrl}/`;
        break;

      default:
        title = 'What to Watch Tonight - Movie & TV Recommendations';
        description = 'Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available.';
        keywords = ['movies', 'TV shows', 'recommendations', 'streaming'];
        canonical = `${baseUrl}/`;
    }

    const backlinks = await this.getBacklinksForPage(pageType, pageData?.slug);

    return {
      title,
      description,
      keywords,
      canonical,
      backlinks,
      structuredData: this.generateStructuredData(pageType, pageData)
    };
  }

  private generateStructuredData(pageType: string, pageData: any): any {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whattowatch.com';

    switch (pageType) {
      case 'movie':
        return {
          "@context": "https://schema.org",
          "@type": "Movie",
          "name": pageData.title,
          "description": pageData.overview,
          "datePublished": pageData.release_date,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": pageData.vote_average,
            "ratingCount": pageData.vote_count
          },
          "image": pageData.poster_path ? `https://image.tmdb.org/t/p/original${pageData.poster_path}` : undefined,
          "url": `${baseUrl}/movie/${pageData.slug}`
        };

      case 'movies':
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Movies Collection",
          "description": "Browse our comprehensive collection of movies",
          "url": `${baseUrl}/movies`
        };

      default:
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "What to Watch Tonight",
          "description": "Movie and TV show recommendations",
          "url": baseUrl
        };
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

