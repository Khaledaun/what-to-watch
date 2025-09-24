import { NextRequest, NextResponse } from 'next/server';
import { SEOCrawler } from '@/lib/seo-crawler';
import { env } from '@/lib/env';

export const runtime = 'edge';

// POST /api/cron/seo-crawl - Daily SEO crawl
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = env.NEXT_PUBLIC_SITE_URL || 'https://what-to-watch-6a62jwcu9-khaledauns-projects.vercel.app';
    const crawler = new SEOCrawler(baseUrl);
    
    // Define pages to crawl
    const pagesToCrawl = [
      '/',
      '/blog',
      '/what-to-watch/tonight',
      '/what-to-watch/on-netflix',
      '/what-to-watch/on-prime',
      '/what-to-watch/under-90-minutes',
      '/what-to-watch/family-night',
      '/what-to-watch/by-mood/feel-good',
      '/what-to-watch/by-mood/intense',
      '/what-to-watch/by-mood/funny'
    ];

    const results = [];
    
    for (const page of pagesToCrawl) {
      const url = `${baseUrl}${page}`;
      console.log(`Crawling: ${url}`);
      
      const result = await crawler.crawlPage(url);
      await crawler.saveCrawlResult(result);
      results.push(result);
      
      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate summary
    const summary = generateCrawlSummary(results);
    
    return NextResponse.json({
      message: 'SEO crawl completed successfully',
      pagesCrawled: results.length,
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('SEO crawl error:', error);
    return NextResponse.json({
      error: 'Failed to perform SEO crawl',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateCrawlSummary(results: any[]) {
  const totalPages = results.length;
  const successPages = results.filter(r => r.status === 'success').length;
  const warningPages = results.filter(r => r.status === 'warning').length;
  const errorPages = results.filter(r => r.status === 'error').length;
  
  const allIssues = results.flatMap(r => r.issues);
  const highPriorityIssues = allIssues.filter(i => i.severity === 'high').length;
  const mediumPriorityIssues = allIssues.filter(i => i.severity === 'medium').length;
  const lowPriorityIssues = allIssues.filter(i => i.severity === 'low').length;
  
  const avgLoadTime = results.reduce((sum, r) => sum + r.metrics.pageLoadTime, 0) / totalPages;
  const pagesWithHTTPS = results.filter(r => r.metrics.httpsEnabled).length;
  const pagesWithStructuredData = results.filter(r => r.metrics.structuredData).length;
  const mobileFriendlyPages = results.filter(r => r.metrics.mobileFriendly).length;

  return {
    totalPages,
    successPages,
    warningPages,
    errorPages,
    issues: {
      high: highPriorityIssues,
      medium: mediumPriorityIssues,
      low: lowPriorityIssues,
      total: allIssues.length
    },
    performance: {
      averageLoadTime: Math.round(avgLoadTime),
      pagesWithHTTPS,
      pagesWithStructuredData,
      mobileFriendlyPages
    },
    recommendations: generateRecommendations(results)
  };
}

function generateRecommendations(results: any[]): string[] {
  const recommendations = [];
  const allIssues = results.flatMap(r => r.issues);
  
  // Check for common issues
  const missingTitles = allIssues.filter(i => i.message.includes('missing a title tag')).length;
  const missingMetaDescriptions = allIssues.filter(i => i.message.includes('missing a meta description')).length;
  const slowPages = results.filter(r => r.metrics.pageLoadTime > 3000).length;
  const nonHTTPSPages = results.filter(r => !r.metrics.httpsEnabled).length;
  const nonMobilePages = results.filter(r => !r.metrics.mobileFriendly).length;
  
  if (missingTitles > 0) {
    recommendations.push(`Fix missing title tags on ${missingTitles} page(s)`);
  }
  
  if (missingMetaDescriptions > 0) {
    recommendations.push(`Add meta descriptions to ${missingMetaDescriptions} page(s)`);
  }
  
  if (slowPages > 0) {
    recommendations.push(`Optimize page load times for ${slowPages} slow page(s)`);
  }
  
  if (nonHTTPSPages > 0) {
    recommendations.push(`Enable HTTPS for ${nonHTTPSPages} page(s)`);
  }
  
  if (nonMobilePages > 0) {
    recommendations.push(`Make ${nonMobilePages} page(s) mobile-friendly`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great job! No major SEO issues found.');
  }
  
  return recommendations;
}
