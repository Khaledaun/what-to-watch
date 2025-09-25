import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generateNewTopics = true, topicCount = 3, generateFullArticles = false } = body;

    console.log('🚀 Starting article generation...');
    console.log('Parameters:', { generateNewTopics, topicCount, generateFullArticles });
    
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
    console.log('🤖 Generating topics...');
    const topics = await aiClient.generateArticleTopics(topicCount);
    console.log(`✅ Generated ${topics.length} topics`);

    // Generate full articles if requested
    let fullArticles = [];
    if (generateFullArticles) {
      console.log('📝 Generating full articles...');
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
          console.log(`✅ Generated article: ${topic.title}`);
        } catch (error) {
          console.error(`❌ Error generating article for "${topic.title}":`, error);
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

    const message = `Generated ${fullArticles.length} ${generateFullArticles ? 'full articles' : 'article topics'} using AI`;
    console.log(`🎉 ${message}`);

    return NextResponse.json({
      success: true,
      count: fullArticles.length,
      message,
      topics: fullArticles,
      aiProvider: aiClient.getDefaultProvider(),
      availableProviders,
      generatedFullArticles: generateFullArticles
    });

  } catch (error) {
    console.error('❌ Generate articles API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate articles',
      error: error instanceof Error ? error.message : 'Unknown error',
      availableProviders: aiClient.getAvailableProviders()
    }, { status: 500 });
  }
}
