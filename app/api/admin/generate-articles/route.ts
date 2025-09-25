import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { aiClient } from '@/lib/ai-client';
import { jobScheduler } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generateNewTopics = true, topicCount = 3, generateFullArticles = false } = body;

    const client = db.ensureClient();
    
    // Check if AI is available
    const availableProviders = aiClient.getAvailableProviders();
    if (availableProviders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No AI providers configured. Please add API keys in Settings.',
        availableProviders: [],
        error: 'AI_NOT_CONFIGURED'
      }, { status: 400 });
    }

    console.log(`Using AI provider: ${aiClient.getDefaultProvider()}`);
    console.log(`Available providers: ${availableProviders.join(', ')}`);

    // Generate topics using AI
    const topics = await aiClient.generateArticleTopics(topicCount);
    
    // Create jobs for each topic
    const createdJobs = [];
    for (const topic of topics) {
      try {
        const job = await jobScheduler.schedule({
          name: `Generate Article: ${topic.title}`,
          type: 'article_generation',
          payload: {
            topicId: topic.slug,
            topicTitle: topic.title,
            category: topic.category,
            keywords: topic.keywords
          },
          priority: 'medium'
        });
        createdJobs.push(job);
      } catch (error) {
        console.error('Error creating job for topic:', topic.title, error);
      }
    }
    
    if (!client) {
      // Return AI-generated topics when database is not available
      return NextResponse.json({
        success: true,
        count: topics.length,
        message: `Generated ${topics.length} AI-powered article topics and created ${createdJobs.length} jobs (database not available)`,
        topics: topics,
        jobs: createdJobs,
        aiProvider: aiClient.getDefaultProvider(),
        availableProviders
      });
    }

    // Generate full articles if requested
    let fullArticles = [];
    if (generateFullArticles) {
      console.log('Generating full articles...');
      for (const topic of topics) {
        try {
          const article = await aiClient.generateFullArticle(topic);
          fullArticles.push({
            ...topic,
            content: article.content,
            excerpt: article.excerpt,
            word_count: article.wordCount,
            seo_score: article.seoScore
          });
        } catch (error) {
          console.error(`Error generating article for "${topic.title}":`, error);
          // Add topic without full content
          fullArticles.push({
            ...topic,
            content: topic.description,
            excerpt: topic.description,
            word_count: 500,
            seo_score: 60
          });
        }
      }
    } else {
      // Just topics
      fullArticles = topics.map(topic => ({
        ...topic,
        content: topic.description,
        excerpt: topic.description,
        word_count: 500,
        seo_score: 60
      }));
    }
    
    // Save to database
    const { data, error } = await client
      .from('content_items')
      .insert(fullArticles.map(article => ({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        status: 'draft',
        type: generateFullArticles ? 'article' : 'topic',
        word_count: article.word_count,
        read_time: Math.ceil(article.word_count / 200),
        seo_score: article.seo_score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();

    if (error) {
      console.error('Error saving topics:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to save topics to database',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: fullArticles.length,
      message: `Generated ${fullArticles.length} ${generateFullArticles ? 'full articles' : 'article topics'} using AI and created ${createdJobs.length} jobs`,
      topics: data,
      jobs: createdJobs,
      aiProvider: aiClient.getDefaultProvider(),
      availableProviders,
      generatedFullArticles: generateFullArticles
    });

  } catch (error) {
    console.error('Generate articles API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate articles',
      error: error instanceof Error ? error.message : 'Unknown error',
      availableProviders: aiClient.getAvailableProviders()
    }, { status: 500 });
  }
}

function generateMockTopics(count: number) {
  const topics = [
    {
      title: "Top 10 Action Movies on Netflix in 2024",
      slug: "top-10-action-movies-netflix-2024",
      content: "Discover the best action movies currently streaming on Netflix. From explosive blockbusters to intense thrillers, these films will keep you on the edge of your seat.",
      excerpt: "From explosive blockbusters to intense thrillers, here are the top action movies you can watch right now.",
      category: "Movie Lists",
      wordCount: 2500
    },
    {
      title: "How to Watch Popular Movies on All Streaming Platforms",
      slug: "how-to-watch-popular-movies-all-platforms",
      content: "Find out where to watch the most popular movies across different streaming services. Our comprehensive guide covers Netflix, Prime Video, Disney+, Hulu, and more.",
      excerpt: "Complete guide to finding and watching popular movies on Netflix, Prime Video, Disney+, and more.",
      category: "Streaming Guides",
      wordCount: 2000
    },
    {
      title: "Netflix vs Disney+ vs Prime Video: Complete Comparison 2024",
      slug: "netflix-vs-disney-plus-vs-prime-video-comparison-2024",
      content: "Compare the top streaming services to find the best one for your needs. We break down pricing, content libraries, features, and more.",
      excerpt: "Detailed comparison of Netflix, Disney+, and Prime Video including content, pricing, and features.",
      category: "Streaming Comparison",
      wordCount: 2800
    },
    {
      title: "Best Drama Movies on Prime Video: Hidden Gems You Need to See",
      slug: "best-drama-movies-prime-video-hidden-gems",
      content: "Explore the most compelling drama movies on Prime Video that you might have missed. These hidden gems offer powerful storytelling and unforgettable performances.",
      excerpt: "Curated list of the best drama movies you can stream on Prime Video.",
      category: "Movie Reviews",
      wordCount: 2200
    },
    {
      title: "The Shawshank Redemption: Why It's Still the #1 Movie of All Time",
      slug: "shawshank-redemption-number-one-movie-all-time",
      content: "Dive deep into why The Shawshank Redemption continues to top movie lists worldwide. We analyze the themes, performances, and timeless appeal of this masterpiece.",
      excerpt: "Analysis of why The Shawshank Redemption remains a cinematic masterpiece.",
      category: "Movie Analysis",
      wordCount: 3000
    }
  ];

  return topics.slice(0, count);
}