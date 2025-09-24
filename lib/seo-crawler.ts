import { db } from './database';

export interface SEOCrawlResult {
  url: string;
  status: 'success' | 'error' | 'warning';
  issues: SEOIssue[];
  metrics: SEOMetrics;
  timestamp: string;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'technical' | 'content' | 'performance' | 'accessibility';
  message: string;
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}

export interface SEOMetrics {
  pageLoadTime: number;
  titleLength: number;
  metaDescriptionLength: number;
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  readabilityScore: number;
  mobileFriendly: boolean;
  httpsEnabled: boolean;
  canonicalUrl?: string;
  structuredData: boolean;
  socialMediaTags: {
    openGraph: boolean;
    twitter: boolean;
  };
}

export class SEOCrawler {
  private db = db;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async crawlPage(url: string): Promise<SEOCrawlResult> {
    const startTime = Date.now();
    const issues: SEOIssue[] = [];
    const metrics: SEOMetrics = {
      pageLoadTime: 0,
      titleLength: 0,
      metaDescriptionLength: 0,
      headingStructure: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
      imageCount: 0,
      imagesWithoutAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      wordCount: 0,
      readabilityScore: 0,
      mobileFriendly: false,
      httpsEnabled: false,
      structuredData: false,
      socialMediaTags: { openGraph: false, twitter: false }
    };

    try {
      // Simulate page crawling (in production, you'd use a real crawler like Puppeteer)
      const response = await this.simulatePageCrawl(url);
      
      metrics.pageLoadTime = Date.now() - startTime;
      
      // Analyze the page content
      await this.analyzePageContent(url, response, issues, metrics);
      
      // Check for common SEO issues
      this.checkSEOIssues(url, response, issues, metrics);

      return {
        url,
        status: issues.some(i => i.type === 'error') ? 'error' : 
                issues.some(i => i.type === 'warning') ? 'warning' : 'success',
        issues,
        metrics,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Failed to crawl ${url}:`, error);
      
      issues.push({
        type: 'error',
        category: 'technical',
        message: `Failed to crawl page: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'high'
      });

      return {
        url,
        status: 'error',
        issues,
        metrics,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async simulatePageCrawl(url: string): Promise<any> {
    // In production, this would use Puppeteer or similar to actually crawl the page
    // For now, we'll simulate the response
    return {
      title: 'Sample Page Title',
      metaDescription: 'Sample meta description',
      headings: ['h1', 'h2', 'h2', 'h3'],
      images: [
        { src: 'image1.jpg', alt: 'Image 1' },
        { src: 'image2.jpg', alt: '' }, // Missing alt text
      ],
      links: [
        { href: '/internal-link', text: 'Internal Link' },
        { href: 'https://external.com', text: 'External Link' }
      ],
      content: 'Sample page content with enough words to analyze...',
      loadTime: Math.random() * 3000 + 500, // 500-3500ms
      https: url.startsWith('https://'),
      mobileFriendly: true,
      structuredData: true,
      openGraph: true,
      twitter: true
    };
  }

  private async analyzePageContent(url: string, response: any, issues: SEOIssue[], metrics: SEOMetrics) {
    // Title analysis
    metrics.titleLength = response.title?.length || 0;
    if (metrics.titleLength === 0) {
      issues.push({
        type: 'error',
        category: 'content',
        message: 'Page is missing a title tag',
        severity: 'high',
        suggestion: 'Add a descriptive title tag to improve SEO'
      });
    } else if (metrics.titleLength < 30) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Title is too short (less than 30 characters)',
        severity: 'medium',
        suggestion: 'Consider expanding the title to be more descriptive'
      });
    } else if (metrics.titleLength > 60) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Title is too long (more than 60 characters)',
        severity: 'medium',
        suggestion: 'Consider shortening the title to avoid truncation in search results'
      });
    }

    // Meta description analysis
    metrics.metaDescriptionLength = response.metaDescription?.length || 0;
    if (metrics.metaDescriptionLength === 0) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Page is missing a meta description',
        severity: 'medium',
        suggestion: 'Add a compelling meta description to improve click-through rates'
      });
    } else if (metrics.metaDescriptionLength < 120) {
      issues.push({
        type: 'info',
        category: 'content',
        message: 'Meta description could be longer (less than 120 characters)',
        severity: 'low',
        suggestion: 'Consider expanding the meta description to provide more detail'
      });
    } else if (metrics.metaDescriptionLength > 160) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Meta description is too long (more than 160 characters)',
        severity: 'medium',
        suggestion: 'Consider shortening the meta description to avoid truncation'
      });
    }

    // Heading structure analysis
    response.headings?.forEach((heading: string) => {
      metrics.headingStructure[heading as keyof typeof metrics.headingStructure]++;
    });

    if (metrics.headingStructure.h1 === 0) {
      issues.push({
        type: 'error',
        category: 'content',
        message: 'Page is missing an H1 heading',
        severity: 'high',
        suggestion: 'Add an H1 heading to improve page structure and SEO'
      });
    } else if (metrics.headingStructure.h1 > 1) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Page has multiple H1 headings',
        severity: 'medium',
        suggestion: 'Use only one H1 heading per page for better SEO'
      });
    }

    // Image analysis
    metrics.imageCount = response.images?.length || 0;
    metrics.imagesWithoutAlt = response.images?.filter((img: any) => !img.alt).length || 0;

    if (metrics.imagesWithoutAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: `${metrics.imagesWithoutAlt} image(s) missing alt text`,
        severity: 'medium',
        suggestion: 'Add descriptive alt text to all images for accessibility and SEO'
      });
    }

    // Link analysis
    metrics.internalLinks = response.links?.filter((link: any) => link.href.startsWith('/')).length || 0;
    metrics.externalLinks = response.links?.filter((link: any) => link.href.startsWith('http')).length || 0;

    // Content analysis
    metrics.wordCount = response.content?.split(' ').length || 0;
    if (metrics.wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Page content is too short (less than 300 words)',
        severity: 'medium',
        suggestion: 'Add more valuable content to improve SEO and user experience'
      });
    }

    // Performance analysis
    if (metrics.pageLoadTime > 3000) {
      issues.push({
        type: 'warning',
        category: 'performance',
        message: 'Page load time is slow (more than 3 seconds)',
        severity: 'medium',
        suggestion: 'Optimize images, minify CSS/JS, and consider using a CDN'
      });
    }

    // Technical analysis
    metrics.httpsEnabled = response.https;
    if (!metrics.httpsEnabled) {
      issues.push({
        type: 'error',
        category: 'technical',
        message: 'Page is not served over HTTPS',
        severity: 'high',
        suggestion: 'Enable HTTPS to improve security and SEO rankings'
      });
    }

    metrics.mobileFriendly = response.mobileFriendly;
    if (!metrics.mobileFriendly) {
      issues.push({
        type: 'error',
        category: 'technical',
        message: 'Page is not mobile-friendly',
        severity: 'high',
        suggestion: 'Implement responsive design for better mobile experience'
      });
    }

    // Structured data analysis
    metrics.structuredData = response.structuredData;
    if (!metrics.structuredData) {
      issues.push({
        type: 'info',
        category: 'technical',
        message: 'Page is missing structured data',
        severity: 'low',
        suggestion: 'Add JSON-LD structured data to improve search result appearance'
      });
    }

    // Social media tags analysis
    metrics.socialMediaTags.openGraph = response.openGraph;
    metrics.socialMediaTags.twitter = response.twitter;
    
    if (!metrics.socialMediaTags.openGraph) {
      issues.push({
        type: 'info',
        category: 'technical',
        message: 'Page is missing Open Graph tags',
        severity: 'low',
        suggestion: 'Add Open Graph tags for better social media sharing'
      });
    }

    if (!metrics.socialMediaTags.twitter) {
      issues.push({
        type: 'info',
        category: 'technical',
        message: 'Page is missing Twitter Card tags',
        severity: 'low',
        suggestion: 'Add Twitter Card tags for better Twitter sharing'
      });
    }
  }

  private checkSEOIssues(url: string, response: any, issues: SEOIssue[], metrics: SEOMetrics) {
    // Additional SEO checks can be added here
    // For example: duplicate content, missing canonical URLs, etc.
  }

  async saveCrawlResult(result: SEOCrawlResult): Promise<void> {
    try {
      const { error } = await this.db.ensureClient()
        .from('seo_crawl_results')
        .insert({
          url: result.url,
          status: result.status,
          issues: result.issues,
          metrics: result.metrics,
          crawled_at: result.timestamp
        });

      if (error) {
        console.error('Failed to save crawl result:', error);
      }
    } catch (error) {
      console.error('Error saving crawl result:', error);
    }
  }

  async getCrawlHistory(url?: string, limit: number = 10): Promise<SEOCrawlResult[]> {
    try {
      let query = this.db.ensureClient()
        .from('seo_crawl_results')
        .select('*')
        .order('crawled_at', { ascending: false })
        .limit(limit);

      if (url) {
        query = query.eq('url', url);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch crawl history:', error);
        return [];
      }

      return (data || []).map(row => ({
        url: row.url,
        status: row.status,
        issues: row.issues,
        metrics: row.metrics,
        timestamp: row.crawled_at
      }));

    } catch (error) {
      console.error('Error fetching crawl history:', error);
      return [];
    }
  }
}
