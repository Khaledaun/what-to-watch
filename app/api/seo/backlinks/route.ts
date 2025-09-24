import { NextRequest, NextResponse } from 'next/server';
import { SEOBacklinkManager } from '@/lib/seo-backlinks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType') || 'home';
    const pageSlug = searchParams.get('pageSlug') || undefined;

    const seoManager = new SEOBacklinkManager();
    const backlinks = await seoManager.getBacklinksForPage(pageType, pageSlug);

    return NextResponse.json({
      backlinks,
      pageType,
      pageSlug,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching backlinks:', error);
    return NextResponse.json({
      error: 'Failed to fetch backlinks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


