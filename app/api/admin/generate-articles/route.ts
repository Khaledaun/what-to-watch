import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generateNewTopics = false, topicCount = 3 } = body;

    // Mock response for now - in a real implementation, this would:
    // 1. Generate new article topics using AI
    // 2. Create jobs in the database
    // 3. Return the count of generated topics

    const mockTopics = [
      {
        id: '1',
        title: 'Top 10 Action Movies on Netflix 2024',
        category: 'Movie Lists',
        priority: 'high',
        wordCount: 2500,
        keywords: ['action movies', 'netflix', '2024', 'streaming']
      },
      {
        id: '2',
        title: 'How to Watch Popular Movies on All Platforms',
        category: 'Streaming Guides',
        priority: 'medium',
        wordCount: 2000,
        keywords: ['streaming', 'platforms', 'movies', 'guide']
      },
      {
        id: '3',
        title: 'Netflix vs Disney+ vs Prime Video Comparison',
        category: 'Streaming Comparison',
        priority: 'low',
        wordCount: 2800,
        keywords: ['netflix', 'disney+', 'prime video', 'comparison']
      }
    ];

    return NextResponse.json({
      success: true,
      count: topicCount,
      topics: mockTopics.slice(0, topicCount),
      message: `Generated ${topicCount} new article topics successfully!`
    });

  } catch (error) {
    console.error('Generate articles error:', error);
    return NextResponse.json({
      error: 'Failed to generate articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}