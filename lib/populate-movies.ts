import { db } from './database';
import { getTrendingMovies, getTopRatedMovies, getNowPlayingMovies, getMovieDetails } from './tmdb-enhanced';
import { generateSlug } from './tmdb-enhanced';

export interface MovieData {
  tmdb_id: number;
  type: 'movie';
  slug: string;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  poster_path: string;
  backdrop_path: string;
  video: boolean;
  created_at: string;
  updated_at: string;
}

export class MoviePopulator {
  private db = db;
  private batchSize = 50;
  private delayMs = 1000; // 1 second delay between batches

  async populateTopMovies(): Promise<void> {
    console.log('Starting to populate top 2000 movies...');
    
    try {
      // Get movies from multiple sources
      const [trending, topRated, nowPlaying] = await Promise.all([
        this.getMoviesFromSource('trending', 20), // 20 pages = 400 movies
        this.getMoviesFromSource('top_rated', 20), // 20 pages = 400 movies
        this.getMoviesFromSource('now_playing', 20), // 20 pages = 400 movies
      ]);

      // Combine and deduplicate
      const allMovies = this.deduplicateMovies([...trending, ...topRated, ...nowPlaying]);
      
      console.log(`Found ${allMovies.length} unique movies to populate`);

      // Process in batches
      for (let i = 0; i < allMovies.length; i += this.batchSize) {
        const batch = allMovies.slice(i, i + this.batchSize);
        await this.processBatch(batch, i / this.batchSize + 1);
        
        // Delay between batches to respect rate limits
        if (i + this.batchSize < allMovies.length) {
          await this.delay(this.delayMs);
        }
      }

      console.log('Successfully populated top movies database!');
    } catch (error) {
      console.error('Error populating movies:', error);
      throw error;
    }
  }

  private async getMoviesFromSource(source: string, pages: number): Promise<any[]> {
    const movies: any[] = [];
    
    for (let page = 1; page <= pages; page++) {
      try {
        let response;
        switch (source) {
          case 'trending':
            response = await getTrendingMovies('week', page, 'US');
            break;
          case 'top_rated':
            response = await getTopRatedMovies(page, 'US');
            break;
          case 'now_playing':
            response = await getNowPlayingMovies(page, 'US');
            break;
          default:
            continue;
        }
        
        if (response?.results) {
          movies.push(...response.results);
        }
        
        // Small delay between pages
        await this.delay(200);
      } catch (error) {
        console.error(`Error fetching ${source} page ${page}:`, error);
      }
    }
    
    return movies;
  }

  private deduplicateMovies(movies: any[]): any[] {
    const seen = new Set();
    return movies.filter(movie => {
      if (seen.has(movie.id)) {
        return false;
      }
      seen.add(movie.id);
      return true;
    });
  }

  private async processBatch(movies: any[], batchNumber: number): Promise<void> {
    console.log(`Processing batch ${batchNumber} with ${movies.length} movies...`);
    
    const movieData: MovieData[] = movies.map(movie => ({
      tmdb_id: movie.id,
      type: 'movie' as const,
      slug: generateSlug(movie.title, new Date(movie.release_date).getFullYear()),
      title: movie.title,
      original_title: movie.original_title,
      overview: movie.overview || '',
      release_date: movie.release_date,
      popularity: movie.popularity || 0,
      vote_average: movie.vote_average || 0,
      vote_count: movie.vote_count || 0,
      adult: movie.adult || false,
      genre_ids: movie.genre_ids || [],
      original_language: movie.original_language || 'en',
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      video: movie.video || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    try {
      // Upsert movies (insert or update if exists)
      const { error } = await this.db.ensureClient()
        .from('titles')
        .upsert(movieData, { 
          onConflict: 'tmdb_id,type',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`Error upserting batch ${batchNumber}:`, error);
      } else {
        console.log(`Successfully processed batch ${batchNumber}`);
      }
    } catch (error) {
      console.error(`Error processing batch ${batchNumber}:`, error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMovieStats(): Promise<{ total: number; byYear: any; byGenre: any }> {
    try {
      const { data: movies, error } = await this.db.ensureClient()
        .from('titles')
        .select('release_date, genre_ids')
        .eq('type', 'movie');

      if (error) {
        console.error('Error fetching movie stats:', error);
        return { total: 0, byYear: {}, byGenre: {} };
      }

      const total = movies?.length || 0;
      const byYear: any = {};
      const byGenre: any = {};

      movies?.forEach((movie: any) => {
        // Count by year
        const year = new Date(movie.release_date).getFullYear();
        byYear[year] = (byYear[year] || 0) + 1;

        // Count by genre
        movie.genre_ids?.forEach((genreId: number) => {
          byGenre[genreId] = (byGenre[genreId] || 0) + 1;
        });
      });

      return { total, byYear, byGenre };
    } catch (error) {
      console.error('Error getting movie stats:', error);
      return { total: 0, byYear: {}, byGenre: {} };
    }
  }
}
