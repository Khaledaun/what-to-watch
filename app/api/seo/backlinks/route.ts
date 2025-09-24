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
      url: '/blog/top-10-action-movies-netflix-2024',
      title: 'Top 10 Action Movies on Netflix 2024',
      description: 'Discover the best action movies currently streaming on Netflix',
      type: 'internal',
      category: 'Movie Lists'
    },
    {
      id: '2',
      url: '/blog/how-to-watch-popular-movies-all-platforms',
      title: 'How to Watch Popular Movies on All Platforms',
      description: 'Complete guide to finding movies across streaming services',
      type: 'internal',
      category: 'Streaming Guides'
    },
    {
      id: '3',
      url: '/blog/netflix-vs-prime-video-better-movies-comparison',
      title: 'Netflix vs Prime Video: Which Has Better Movies?',
      description: 'Compare the movie libraries of top streaming services',
      type: 'internal',
      category: 'Streaming Comparison'
    },
    {
      id: '4',
      url: '/movies/trending',
      title: 'Trending Movies This Week',
      description: 'See what movies are trending and popular right now',
      type: 'internal',
      category: 'Movie Discovery'
    },
    {
      id: '5',
      url: '/blog/best-drama-movies-prime-video-hidden-gems',
      title: 'Best Drama Movies on Prime Video',
      description: 'Hidden gem drama movies you need to watch',
      type: 'internal',
      category: 'Movie Reviews'
    }
  ];

  // Filter backlinks based on page type
  let filteredBacklinks = baseBacklinks;

  switch (pageType) {
    case 'home':
      filteredBacklinks = baseBacklinks.filter(link => 
        link.category.includes('Movie') || 
        link.category.includes('Streaming')
      );
      break;
    case 'movies':
      filteredBacklinks = baseBacklinks.filter(link => 
        link.category.includes('Movie') || 
        link.category.includes('Discovery')
      );
      break;
    case 'streaming':
      filteredBacklinks = baseBacklinks.filter(link => 
        link.category.includes('Streaming') || 
        link.category.includes('Guide')
      );
      break;
    default:
      filteredBacklinks = baseBacklinks;
  }

  return filteredBacklinks.slice(0, limit);
}