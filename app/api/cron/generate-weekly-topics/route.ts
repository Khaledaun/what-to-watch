import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const client = db.ensureClient();
    
    if (!client) {
      // Return mock response when database is not available
      return NextResponse.json({
        success: true,
        message: 'Generated mock weekly topics (database not available)',
        topicsGenerated: 5,
        topics: [
          {
            title: 'Top 10 Action Movies on Netflix in 2024',
            category: 'Movie Lists',
            priority: 'high',
            estimatedWords: 2500
          },
          {
            title: 'How to Watch Popular Movies on All Streaming Platforms',
            category: 'Streaming Guides',
            priority: 'medium',
            estimatedWords: 2000
          },
          {
            title: 'Netflix vs Disney+ vs Prime Video: Complete Comparison 2024',
            category: 'Streaming Comparison',
            priority: 'high',
            estimatedWords: 2800
          },
          {
            title: 'Best Drama Movies on Prime Video: Hidden Gems',
            category: 'Movie Reviews',
            priority: 'medium',
            estimatedWords: 2200
          },
          {
            title: 'The Shawshank Redemption: Why It\'s Still #1',
            category: 'Movie Analysis',
            priority: 'low',
            estimatedWords: 3000
          }
        ]
      });
    }

    // Generate weekly topics
    const weeklyTopics = generateWeeklyTopics();
    
    // Save topics to database
    const { data, error } = await client
      .from('content_items')
      .insert(weeklyTopics.map(topic => ({
        title: topic.title,
        slug: topic.slug,
        content: topic.content,
        excerpt: topic.excerpt,
        category: topic.category,
        status: 'draft',
        type: 'topic',
        word_count: topic.estimatedWords,
        read_time: Math.ceil(topic.estimatedWords / 200),
        priority: topic.priority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();

    if (error) {
      console.error('Error saving weekly topics:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to save weekly topics',
        error: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Generated ${weeklyTopics.length} weekly topics`,
      topicsGenerated: weeklyTopics.length,
      topics: data
    });

  } catch (error) {
    console.error('Generate weekly topics API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate weekly topics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateWeeklyTopics() {
  const currentDate = new Date();
  const weekNumber = Math.ceil(currentDate.getDate() / 7);
  
  const topics = [
    {
      title: `Top 10 Action Movies on Netflix in ${currentDate.getFullYear()}`,
      slug: `top-10-action-movies-netflix-${currentDate.getFullYear()}`,
      content: `Discover the best action movies currently streaming on Netflix in ${currentDate.getFullYear()}. From explosive blockbusters to intense thrillers, these films will keep you on the edge of your seat.`,
      excerpt: `From explosive blockbusters to intense thrillers, here are the top action movies you can watch right now on Netflix.`,
      category: 'Movie Lists',
      priority: 'high',
      estimatedWords: 2500
    },
    {
      title: 'How to Watch Popular Movies on All Streaming Platforms',
      slug: 'how-to-watch-popular-movies-all-platforms',
      content: 'Find out where to watch the most popular movies across different streaming services. Our comprehensive guide covers Netflix, Prime Video, Disney+, Hulu, and more.',
      excerpt: 'Complete guide to finding and watching popular movies on Netflix, Prime Video, Disney+, and more.',
      category: 'Streaming Guides',
      priority: 'medium',
      estimatedWords: 2000
    },
    {
      title: 'Netflix vs Disney+ vs Prime Video: Complete Comparison 2024',
      slug: 'netflix-vs-disney-plus-vs-prime-video-comparison-2024',
      content: 'Compare the top streaming services to find the best one for your needs. We break down pricing, content libraries, features, and more.',
      excerpt: 'Detailed comparison of Netflix, Disney+, and Prime Video including content, pricing, and features.',
      category: 'Streaming Comparison',
      priority: 'high',
      estimatedWords: 2800
    },
    {
      title: 'Best Drama Movies on Prime Video: Hidden Gems You Need to See',
      slug: 'best-drama-movies-prime-video-hidden-gems',
      content: 'Explore the most compelling drama movies on Prime Video that you might have missed. These hidden gems offer powerful storytelling and unforgettable performances.',
      excerpt: 'Curated list of the best drama movies you can stream on Prime Video.',
      category: 'Movie Reviews',
      priority: 'medium',
      estimatedWords: 2200
    },
    {
      title: 'The Shawshank Redemption: Why It\'s Still the #1 Movie of All Time',
      slug: 'shawshank-redemption-number-one-movie-all-time',
      content: 'Dive deep into why The Shawshank Redemption continues to top movie lists worldwide. We analyze the themes, performances, and timeless appeal of this masterpiece.',
      excerpt: 'Analysis of why The Shawshank Redemption remains a cinematic masterpiece.',
      category: 'Movie Analysis',
      priority: 'low',
      estimatedWords: 3000
    }
  ];

  return topics;
}