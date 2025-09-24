import { db, ContentKind, ContentStatus } from './database';
import { env } from './env';

// Content generation templates
const CONTENT_TEMPLATES = {
  top10_movies: {
    title: 'Top 10 {{genre}} Movies to Watch {{country}}',
    template: `# Top 10 {{genre}} Movies to Watch {{country}}

Discover the best {{genre.toLowerCase()}} movies available to stream right now. Our curated list features the highest-rated films that are perfect for your next movie night.

{{#each movies}}
## {{@index}}. {{title}} ({{year}})
{{overview}}

**Where to watch:** {{providers}}
**Runtime:** {{runtime}} minutes
**Rating:** {{rating}}/10

{{/each}}

## How We Choose Our Recommendations

Our recommendations are based on:
- **Critical acclaim** from both audiences and critics
- **Availability** on major streaming platforms
- **Recent releases** and timeless classics
- **Genre diversity** to suit different tastes

*Last updated: {{date}}*
*Data provided by TMDB API*`
  },
  
  top10_tv: {
    title: 'Top 10 {{genre}} TV Shows to Watch {{country}}',
    template: `# Top 10 {{genre}} TV Shows to Watch {{country}}

Binge-watch your way through the best {{genre.toLowerCase()}} TV shows available on streaming platforms. From gripping dramas to laugh-out-loud comedies, these series are perfect for your next viewing marathon.

{{#each shows}}
## {{@index}}. {{title}} ({{year}})
{{overview}}

**Where to watch:** {{providers}}
**Seasons:** {{seasons}}
**Episodes:** {{episodes}}

{{/each}}

## What Makes These Shows Special

Our selection criteria include:
- **Compelling storytelling** that keeps you hooked
- **Strong character development** and memorable performances
- **Critical and audience acclaim** across multiple platforms
- **Easy availability** on popular streaming services

*Last updated: {{date}}*
*Data provided by TMDB API*`
  },
  
  how_to_watch: {
    title: 'How to Watch {{title}} ({{year}}) - Streaming Guide',
    template: `# How to Watch {{title}} ({{year}})

{{overview}}

## Where to Stream {{title}}

{{#each providers}}
### {{name}}
{{url}}
{{/each}}

## Cast & Crew

{{#each cast}}
- **{{name}}** as {{character}}
{{/each}}

## About {{title}}

{{overview}}

**Release Date:** {{release_date}}
**Runtime:** {{runtime}} minutes
**Genre:** {{genres}}
**Rating:** {{rating}}/10

## Similar Recommendations

If you enjoyed {{title}}, you might also like:
- [Similar Movie 1]
- [Similar Movie 2]
- [Similar Movie 3]

*Last updated: {{date}}*
*Data provided by TMDB API*`
  },
  
  comparison: {
    title: '{{title1}} vs {{title2}}: Which Should You Watch?',
    template: `# {{title1}} vs {{title2}}: Which Should You Watch?

Torn between two great options? We break down {{title1}} and {{title2}} to help you decide which one deserves your precious viewing time.

## {{title1}} ({{year1}})
{{overview1}}

**Runtime:** {{runtime1}} minutes
**Rating:** {{rating1}}/10
**Where to watch:** {{providers1}}

## {{title2}} ({{year2}})
{{overview2}}

**Runtime:** {{runtime2}} minutes
**Rating:** {{rating2}}/10
**Where to watch:** {{providers2}}

## Head-to-Head Comparison

| Feature | {{title1}} | {{title2}} |
|---------|------------|------------|
| Rating | {{rating1}}/10 | {{rating2}}/10 |
| Runtime | {{runtime1}} min | {{runtime2}} min |
| Genre | {{genres1}} | {{genres2}} |
| Availability | {{providers1}} | {{providers2}} |

## Our Verdict

{{comparison}}

## Final Recommendation

{{recommendation}}

*Last updated: {{date}}*
*Data provided by TMDB API*`
  }
};

// Content generation functions
export class ContentGenerator {
  private db = db;

  async generateTop10Content(
    type: 'movie' | 'tv',
    genre: string,
    country: string
  ): Promise<string> {
    // Get top-rated titles for the genre and country
    const { data: titles } = await this.db.ensureClient()
      .from('titles')
      .select(`
        *,
        factsheets!inner(curated_data),
        watch_providers!inner(flatrate, rent, buy)
      `)
      .eq('type', type)
      .contains('genres', [this.getGenreId(genre)])
      .eq('watch_providers.country', country)
      .order('vote_average', { ascending: false })
      .limit(10);

    if (!titles || titles.length === 0) {
      throw new Error(`No ${type}s found for genre ${genre} in ${country}`);
    }

    const template = type === 'movie' ? CONTENT_TEMPLATES.top10_movies : CONTENT_TEMPLATES.top10_tv;
    
    return this.renderTemplate(template.template, {
      genre,
      country,
      [type === 'movie' ? 'movies' : 'shows']: titles.map(title => ({
        title: title.title,
        year: new Date(title.release_date || title.first_air_date).getFullYear(),
        overview: title.overview,
        providers: this.formatProviders(title.watch_providers),
        runtime: title.runtime,
        rating: title.vote_average,
        seasons: title.season_count,
        episodes: title.episode_count
      })),
      date: new Date().toLocaleDateString()
    });
  }

  async generateHowToWatchContent(
    titleId: string,
    country: string
  ): Promise<string> {
    const { data: title } = await this.db.ensureClient()
      .from('titles')
      .select(`
        *,
        factsheets!inner(curated_data),
        watch_providers!inner(flatrate, rent, buy),
        credits_people!inner(
          character,
          people!inner(name, profile_path)
        )
      `)
      .eq('id', titleId)
      .eq('watch_providers.country', country)
      .single();

    if (!title) {
      throw new Error(`Title not found: ${titleId}`);
    }

    const template = CONTENT_TEMPLATES.how_to_watch;
    
    return this.renderTemplate(template.template, {
      title: title.title,
      year: new Date(title.release_date || title.first_air_date).getFullYear(),
      overview: title.overview,
      providers: this.formatProviders(title.watch_providers),
      cast: title.credits_people?.filter((c: any) => c.character) || [],
      release_date: title.release_date || title.first_air_date,
      runtime: title.runtime,
      genres: title.genres?.map((g: number) => this.getGenreName(g)).join(', '),
      rating: title.vote_average,
      date: new Date().toLocaleDateString()
    });
  }

  async generateComparisonContent(
    titleId1: string,
    titleId2: string,
    country: string
  ): Promise<string> {
    const [title1, title2] = await Promise.all([
      this.db.ensureClient()
        .from('titles')
        .select(`
          *,
          factsheets!inner(curated_data),
          watch_providers!inner(flatrate, rent, buy)
        `)
        .eq('id', titleId1)
        .eq('watch_providers.country', country)
        .single(),
      this.db.ensureClient()
        .from('titles')
        .select(`
          *,
          factsheets!inner(curated_data),
          watch_providers!inner(flatrate, rent, buy)
        `)
        .eq('id', titleId2)
        .eq('watch_providers.country', country)
        .single()
    ]);

    if (!title1.data || !title2.data) {
      throw new Error('One or both titles not found');
    }

    const template = CONTENT_TEMPLATES.comparison;
    
    return this.renderTemplate(template.template, {
      title1: title1.data.title,
      title2: title2.data.title,
      year1: new Date(title1.data.release_date || title1.data.first_air_date).getFullYear(),
      year2: new Date(title2.data.release_date || title2.data.first_air_date).getFullYear(),
      overview1: title1.data.overview,
      overview2: title2.data.overview,
      runtime1: title1.data.runtime,
      runtime2: title2.data.runtime,
      rating1: title1.data.vote_average,
      rating2: title2.data.vote_average,
      providers1: this.formatProviders(title1.data.watch_providers),
      providers2: this.formatProviders(title2.data.watch_providers),
      genres1: title1.data.genres?.map((g: number) => this.getGenreName(g)).join(', '),
      genres2: title2.data.genres?.map((g: number) => this.getGenreName(g)).join(', '),
      comparison: this.generateComparisonText(title1.data, title2.data),
      recommendation: this.generateRecommendation(title1.data, title2.data),
      date: new Date().toLocaleDateString()
    });
  }

  async generateContentPack(
    countries: string[] = ['US', 'CA']
  ): Promise<Array<{ kind: ContentKind; title: string; content: string; country: string }>> {
    const contentItems: Array<{ kind: ContentKind; title: string; content: string; country: string }> = [];

    for (const country of countries) {
      // Generate Top 10 Movies
      try {
        const top10Movies = await this.generateTop10Content('movie', 'Drama', country);
        contentItems.push({
          kind: 'top',
          title: `Top 10 Drama Movies to Watch ${country}`,
          content: top10Movies,
          country
        });
      } catch (error) {
        console.error(`Failed to generate top 10 movies for ${country}:`, error);
      }

      // Generate Top 10 TV Shows
      try {
        const top10TV = await this.generateTop10Content('tv', 'Drama', country);
        contentItems.push({
          kind: 'top',
          title: `Top 10 Drama TV Shows to Watch ${country}`,
          content: top10TV,
          country
        });
      } catch (error) {
        console.error(`Failed to generate top 10 TV shows for ${country}:`, error);
      }

      // Generate How-to-Watch articles
      try {
        const { data: popularTitles } = await this.db.ensureClient()
          .from('titles')
          .select('id, title')
          .order('popularity', { ascending: false })
          .limit(2);

        if (popularTitles) {
          for (const title of popularTitles) {
            const howToContent = await this.generateHowToWatchContent(title.id, country);
            contentItems.push({
              kind: 'howto',
              title: `How to Watch ${title.title}`,
              content: howToContent,
              country
            });
          }
        }
      } catch (error) {
        console.error(`Failed to generate how-to-watch content for ${country}:`, error);
      }
    }

    return contentItems;
  }

  async saveContentItems(
    contentItems: Array<{ kind: ContentKind; title: string; content: string; country: string }>,
    createdBy: string = 'system'
  ): Promise<void> {
    for (const item of contentItems) {
      const slug = this.generateSlug(item.title);
      
      await this.db.createContentItem({
        kind: item.kind,
        slug,
        country: item.country,
        language: 'en-US',
        status: 'draft',
        body_md: item.content,
        created_by: createdBy,
        updated_by: createdBy,
        seo_jsonld: this.generateSEOJsonLD(item)
      });
    }
  }

  // Helper methods
  private renderTemplate(template: string, data: any): string {
    let rendered = template;
    
    // Simple template rendering (in production, use a proper template engine like Handlebars)
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (Array.isArray(value)) {
        // Handle arrays (like movies, shows, cast)
        const arrayRegex = new RegExp(`{{#each ${key}}}([\\s\\S]*?){{/each}}`, 'g');
        rendered = rendered.replace(arrayRegex, (match, content) => {
          return value.map((item, index) => {
            let itemContent = content;
            Object.keys(item).forEach(itemKey => {
              const itemValue = item[itemKey];
              itemContent = itemContent.replace(new RegExp(`{{${itemKey}}}`, 'g'), itemValue || '');
              itemContent = itemContent.replace(new RegExp(`{{@index}}`, 'g'), (index + 1).toString());
            });
            return itemContent;
          }).join('\n');
        });
      } else {
        // Handle simple values
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
      }
    });
    
    return rendered;
  }

  private formatProviders(providers: any): string {
    if (!providers) return 'Not available';
    
    const allProviders = [
      ...(providers.flatrate || []),
      ...(providers.rent || []),
      ...(providers.buy || [])
    ];
    
    return allProviders
      .map(p => p.provider_name)
      .filter((name, index, arr) => arr.indexOf(name) === index)
      .join(', ');
  }

  private getGenreId(genreName: string): number {
    // This would map genre names to TMDB genre IDs
    const genreMap: Record<string, number> = {
      'Drama': 18,
      'Comedy': 35,
      'Action': 28,
      'Thriller': 53,
      'Horror': 27,
      'Romance': 10749,
      'Sci-Fi': 878,
      'Fantasy': 14,
      'Adventure': 12,
      'Crime': 80,
      'Mystery': 9648,
      'Family': 10751,
      'Animation': 16,
      'Documentary': 99,
      'History': 36,
      'War': 10752,
      'Western': 37,
      'Music': 10402,
      'Sport': 10770
    };
    
    return genreMap[genreName] || 18; // Default to Drama
  }

  private getGenreName(genreId: number): string {
    // This would map TMDB genre IDs to genre names
    const genreMap: Record<number, string> = {
      18: 'Drama',
      35: 'Comedy',
      28: 'Action',
      53: 'Thriller',
      27: 'Horror',
      10749: 'Romance',
      878: 'Sci-Fi',
      14: 'Fantasy',
      12: 'Adventure',
      80: 'Crime',
      9648: 'Mystery',
      10751: 'Family',
      16: 'Animation',
      99: 'Documentary',
      36: 'History',
      10752: 'War',
      37: 'Western',
      10402: 'Music',
      10770: 'Sport'
    };
    
    return genreMap[genreId] || 'Unknown';
  }

  private generateComparisonText(title1: any, title2: any): string {
    const rating1 = title1.vote_average;
    const rating2 = title2.vote_average;
    
    if (rating1 > rating2) {
      return `${title1.title} has a higher rating (${rating1}/10 vs ${rating2}/10) and is generally considered more critically acclaimed.`;
    } else if (rating2 > rating1) {
      return `${title2.title} has a higher rating (${rating2}/10 vs ${rating1}/10) and is generally considered more critically acclaimed.`;
    } else {
      return `Both titles have similar ratings (${rating1}/10), making this a close comparison based on personal preference.`;
    }
  }

  private generateRecommendation(title1: any, title2: any): string {
    const rating1 = title1.vote_average;
    const rating2 = title2.vote_average;
    
    if (rating1 > rating2) {
      return `We recommend ${title1.title} for its higher critical acclaim and audience rating.`;
    } else if (rating2 > rating1) {
      return `We recommend ${title2.title} for its higher critical acclaim and audience rating.`;
    } else {
      return `Both titles are excellent choices. Choose based on your mood and preferred genre.`;
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateSEOJsonLD(item: { kind: ContentKind; title: string; content: string; country: string }): any {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": item.title,
      "description": item.content.substring(0, 160),
      "author": {
        "@type": "Organization",
        "name": env.SITE_BRAND_NAME
      },
      "publisher": {
        "@type": "Organization",
        "name": env.SITE_BRAND_NAME
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}/content/${this.generateSlug(item.title)}`
      }
    };
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();
