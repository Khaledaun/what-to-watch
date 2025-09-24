import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType') || 'home';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock backlinks data based on page type
    const backlinks = getMockBacklinks(pageType, limit);

    return NextResponse.json({
      backlinks,
      total: backlinks.length,
      pageType,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Backlinks API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch backlinks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getMockBacklinks(pageType: string, limit: number) {
  const baseBacklinks = [
    {
      id: '1',
      url: 'https://example.com/movie-reviews',
      title: 'Movie Reviews Blog',
      description: 'Comprehensive movie reviews and recommendations',
      domain: 'example.com',
      domainRating: 85,
      anchorText: 'movie recommendations',
      linkType: 'dofollow',
      discoveredAt: '2024-01-20T10:00:00Z',
      lastChecked: '2024-01-25T15:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      url: 'https://cinema-blog.com/streaming-guides',
      title: 'Cinema Blog - Streaming Guides',
      description: 'Your guide to streaming movies and TV shows',
      domain: 'cinema-blog.com',
      domainRating: 72,
      anchorText: 'streaming guide',
      linkType: 'dofollow',
      discoveredAt: '2024-01-18T14:20:00Z',
      lastChecked: '2024-01-25T15:30:00Z',
      status: 'active'
    },
    {
      id: '3',
      url: 'https://entertainment-news.com/what-to-watch',
      title: 'Entertainment News - What to Watch',
      description: 'Latest entertainment news and what to watch recommendations',
      domain: 'entertainment-news.com',
      domainRating: 68,
      anchorText: 'what to watch tonight',
      linkType: 'dofollow',
      discoveredAt: '2024-01-15T09:45:00Z',
      lastChecked: '2024-01-25T15:30:00Z',
      status: 'active'
    },
    {
      id: '4',
      url: 'https://movie-fanatics.com/recommendations',
      title: 'Movie Fanatics - Recommendations',
      description: 'Movie recommendations for every mood and occasion',
      domain: 'movie-fanatics.com',
      domainRating: 91,
      anchorText: 'movie recommendations',
      linkType: 'dofollow',
      discoveredAt: '2024-01-12T16:30:00Z',
      lastChecked: '2024-01-25T15:30:00Z',
      status: 'active'
    },
    {
      id: '5',
      url: 'https://streaming-guide.net/best-movies',
      title: 'Streaming Guide - Best Movies',
      description: 'Find the best movies to stream on your favorite platforms',
      domain: 'streaming-guide.net',
      domainRating: 76,
      anchorText: 'best movies to stream',
      linkType: 'dofollow',
      discoveredAt: '2024-01-10T11:15:00Z',
      lastChecked: '2024-01-25T15:30:00Z',
      status: 'active'
    }
  ];

  // Filter backlinks based on page type
  let filteredBacklinks = baseBacklinks;

  switch (pageType) {
    case 'home':
      filteredBacklinks = baseBacklinks.filter(link => 
        link.anchorText.includes('recommendations') || 
        link.anchorText.includes('what to watch')
      );
      break;
    case 'movies':
      filteredBacklinks = baseBacklinks.filter(link => 
        link.anchorText.includes('movie') || 
        link.anchorText.includes('cinema')
      );
      break;
    case 'streaming':
      filteredBacklinks = baseBacklinks.filter(link => 
        link.anchorText.includes('streaming') || 
        link.anchorText.includes('watch')
      );
      break;
    default:
      filteredBacklinks = baseBacklinks;
  }

  return filteredBacklinks.slice(0, limit);
}