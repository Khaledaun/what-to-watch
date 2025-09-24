import { db } from './database';
import { env } from './env';

export interface CrawlResult {
  url: string;
  status: number;
  title?: string;
  description?: string;
  error?: string;
  timestamp: string;
  responseTime: number;
}

export interface CrawlReport {
  totalUrls: number;
  successCount: number;
  errorCount: number;
  fourOhFourCount: number;
  averageResponseTime: number;
  errors: CrawlResult[];
  fourOhFours: CrawlResult[];
  timestamp: string;
}

export class ProfessionalCrawler {
  private baseUrl: string;
  private maxConcurrency: number = 10;
  private delayMs: number = 100; // 100ms between requests
  private timeout: number = 10000; // 10 seconds timeout

  constructor(baseUrl: string = env.NEXT_PUBLIC_SITE_URL || 'https://whattowatch.com') {
    this.baseUrl = baseUrl;
  }

  async crawlWebsite(): Promise<CrawlReport> {
    console.log('Starting professional website crawl...');
    
    const urls = await this.generateUrlsToCrawl();
    console.log(`Found ${urls.length} URLs to crawl`);

    const results: CrawlResult[] = [];
    const startTime = Date.now();

    // Process URLs in batches to respect rate limits
    for (let i = 0; i < urls.length; i += this.maxConcurrency) {
      const batch = urls.slice(i, i + this.maxConcurrency);
      const batchPromises = batch.map(url => this.crawlUrl(url));
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            url: batch[index],
            status: 0,
            error: result.reason?.message || 'Unknown error',
            timestamp: new Date().toISOString(),
            responseTime: 0
          });
        }
      });

      // Delay between batches
      if (i + this.maxConcurrency < urls.length) {
        await this.delay(this.delayMs);
      }
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    return this.generateReport(results, totalTime);
  }

  private async generateUrlsToCrawl(): Promise<string[]> {
    const urls = new Set<string>();

    // Add main pages
    urls.add(`${this.baseUrl}/`);
    urls.add(`${this.baseUrl}/movies`);
    urls.add(`${this.baseUrl}/search`);
    urls.add(`${this.baseUrl}/blog`);
    urls.add(`${this.baseUrl}/contact`);
    urls.add(`${this.baseUrl}/privacy`);
    urls.add(`${this.baseUrl}/accessibility`);

    // Add recommendation pages
    urls.add(`${this.baseUrl}/what-to-watch/tonight`);
    urls.add(`${this.baseUrl}/what-to-watch/on-netflix`);
    urls.add(`${this.baseUrl}/what-to-watch/on-prime`);
    urls.add(`${this.baseUrl}/what-to-watch/on-disney-plus`);
    urls.add(`${this.baseUrl}/what-to-watch/on-hulu`);
    urls.add(`${this.baseUrl}/what-to-watch/on-max`);
    urls.add(`${this.baseUrl}/what-to-watch/on-apple-tv-plus`);

    // Add movie pages from database
    try {
      const { data: movies, error } = await db.ensureClient()
        .from('titles')
        .select('slug')
        .eq('type', 'movie')
        .limit(1000); // Crawl top 1000 movies

      if (!error && movies) {
        movies.forEach(movie => {
          urls.add(`${this.baseUrl}/movie/${movie.slug}`);
        });
      }
    } catch (error) {
      console.error('Error fetching movie URLs:', error);
    }

    // Add blog posts
    try {
      const { data: posts, error } = await db.ensureClient()
        .from('content_items')
        .select('slug')
        .eq('status', 'published')
        .limit(100);

      if (!error && posts) {
        posts.forEach(post => {
          urls.add(`${this.baseUrl}/blog/${post.slug}`);
        });
      }
    } catch (error) {
      console.error('Error fetching blog URLs:', error);
    }

    return Array.from(urls);
  }

  private async crawlUrl(url: string): Promise<CrawlResult> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Professional-Crawler/1.0 (SEO Monitoring)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let title = '';
      let description = '';

      if (response.ok) {
        const html = await response.text();
        title = this.extractTitle(html);
        description = this.extractDescription(html);
      }

      return {
        url,
        status: response.status,
        title,
        description,
        timestamp: new Date().toISOString(),
        responseTime
      };

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        url,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        responseTime
      };
    }
  }

  private extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  private extractDescription(html: string): string {
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    return descMatch ? descMatch[1].trim() : '';
  }

  private generateReport(results: CrawlResult[], totalTime: number): CrawlReport {
    const successCount = results.filter(r => r.status >= 200 && r.status < 300).length;
    const errorCount = results.filter(r => r.status >= 400).length;
    const fourOhFourCount = results.filter(r => r.status === 404).length;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    const errors = results.filter(r => r.status >= 400);
    const fourOhFours = results.filter(r => r.status === 404);

    return {
      totalUrls: results.length,
      successCount,
      errorCount,
      fourOhFourCount,
      averageResponseTime,
      errors,
      fourOhFours,
      timestamp: new Date().toISOString()
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveCrawlReport(report: CrawlReport): Promise<void> {
    try {
      const { error } = await db.ensureClient()
        .from('crawl_reports')
        .insert({
          total_urls: report.totalUrls,
          success_count: report.successCount,
          error_count: report.errorCount,
          four_oh_four_count: report.fourOhFourCount,
          average_response_time: report.averageResponseTime,
          errors: report.errors,
          four_oh_fours: report.fourOhFours,
          created_at: report.timestamp
        });

      if (error) {
        console.error('Error saving crawl report:', error);
      } else {
        console.log('Crawl report saved successfully');
      }
    } catch (error) {
      console.error('Error saving crawl report:', error);
    }
  }

  async getLatestCrawlReport(): Promise<CrawlReport | null> {
    try {
      const { data: report, error } = await db.ensureClient()
        .from('crawl_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !report) {
        return null;
      }

      return {
        totalUrls: report.total_urls,
        successCount: report.success_count,
        errorCount: report.error_count,
        fourOhFourCount: report.four_oh_four_count,
        averageResponseTime: report.average_response_time,
        errors: report.errors || [],
        fourOhFours: report.four_oh_fours || [],
        timestamp: report.created_at
      };
    } catch (error) {
      console.error('Error fetching crawl report:', error);
      return null;
    }
  }
}
