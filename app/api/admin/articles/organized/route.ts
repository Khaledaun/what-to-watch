import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'published_at';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get articles with organized metadata
    const { data: articles, error } = await db.ensureClient()
      .from('content_items')
      .select(`
        id,
        slug,
        kind,
        body_md,
        published_at,
        created_at,
        seo_jsonld,
        status
      `)
      .eq('status', 'published')
      .order(sortBy, { ascending: order === 'asc' })
      .limit(limit);

    if (error) {
      console.error('Error fetching organized articles:', error);
      return NextResponse.json({
        error: 'Failed to fetch articles',
        message: error.message
      }, { status: 500 });
    }

    // Transform articles with organized metadata
    const organizedArticles = articles?.map((article: any) => {
      const seoData = typeof article.seo_jsonld === 'string' 
        ? JSON.parse(article.seo_jsonld) 
        : article.seo_jsonld;

      // Extract metadata from SEO data
      const topic = seoData?.headline || article.slug;
      const keywords = seoData?.keywords || [];
      const longtails = seoData?.longtails || [];
      
      // Calculate word count and reading time
      const wordCount = article.body_md?.split(/\s+/).length || 0;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

      // Extract affiliate links from content (mock implementation)
      const affiliateLinks = extractAffiliateLinks(article.body_md || '');

      return {
        id: article.id,
        slug: article.slug,
        kind: article.kind,
        title: topic,
        topic: topic,
        keywords: keywords,
        longtails: longtails,
        wordCount: wordCount,
        readingTime: readingTime,
        publishedAt: article.published_at,
        createdAt: article.created_at,
        status: article.status,
        affiliateLinks: affiliateLinks,
        seoScore: calculateSEOScore(article, seoData),
        url: `/blog/${article.slug}`,
        excerpt: article.body_md?.substring(0, 150) + '...' || ''
      };
    }) || [];

    // Calculate summary statistics
    const summary = {
      total: organizedArticles.length,
      byKind: organizedArticles.reduce((acc: any, article: any) => {
        acc[article.kind] = (acc[article.kind] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalWords: organizedArticles.reduce((sum: number, article: any) => sum + article.wordCount, 0),
      averageReadingTime: Math.round(organizedArticles.reduce((sum: number, article: any) => sum + article.readingTime, 0) / organizedArticles.length),
      totalAffiliateLinks: organizedArticles.reduce((sum: number, article: any) => sum + article.affiliateLinks.length, 0),
      averageSEOScore: Math.round(organizedArticles.reduce((sum: number, article: any) => sum + article.seoScore, 0) / organizedArticles.length)
    };

    return NextResponse.json({
      articles: organizedArticles,
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in organized articles API:', error);
    return NextResponse.json({
      error: 'Failed to fetch organized articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to extract affiliate links from content
function extractAffiliateLinks(content: string): Array<{url: string, text: string, type: string}> {
  const affiliateLinks: Array<{url: string, text: string, type: string}> = [];
  
  // Look for common affiliate link patterns
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const text = match[1];
    const url = match[2];
    
    // Check if it's an affiliate link
    if (isAffiliateLink(url)) {
      affiliateLinks.push({
        url,
        text,
        type: getAffiliateType(url)
      });
    }
  }
  
  return affiliateLinks;
}

// Helper function to check if a URL is an affiliate link
function isAffiliateLink(url: string): boolean {
  const affiliateDomains = [
    'netflix.com',
    'amazon.com',
    'amazon.com/prime',
    'disneyplus.com',
    'hulu.com',
    'hbomax.com',
    'appletv.com'
  ];
  
  return affiliateDomains.some(domain => url.includes(domain));
}

// Helper function to get affiliate type
function getAffiliateType(url: string): string {
  if (url.includes('netflix.com')) return 'netflix';
  if (url.includes('amazon.com')) return 'amazon';
  if (url.includes('disneyplus.com')) return 'disney';
  if (url.includes('hulu.com')) return 'hulu';
  if (url.includes('hbomax.com')) return 'hbo';
  if (url.includes('appletv.com')) return 'apple';
  return 'other';
}

// Helper function to calculate SEO score
function calculateSEOScore(article: any, seoData: any): number {
  let score = 0;
  
  // Title length (optimal: 50-60 characters)
  const title = seoData?.headline || article.slug;
  if (title.length >= 50 && title.length <= 60) score += 20;
  else if (title.length >= 40 && title.length <= 70) score += 15;
  else score += 10;
  
  // Description length (optimal: 150-160 characters)
  const description = seoData?.description || '';
  if (description.length >= 150 && description.length <= 160) score += 20;
  else if (description.length >= 120 && description.length <= 180) score += 15;
  else score += 10;
  
  // Keywords presence
  if (seoData?.keywords && seoData.keywords.length > 0) score += 15;
  
  // Longtails presence
  if (seoData?.longtails && seoData.longtails.length > 0) score += 15;
  
  // Content length (optimal: 1000+ words)
  const wordCount = article.body_md?.split(/\s+/).length || 0;
  if (wordCount >= 1000) score += 20;
  else if (wordCount >= 500) score += 15;
  else score += 10;
  
  return Math.min(score, 100);
}

