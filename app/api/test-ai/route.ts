import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing AI Client...');
    
    const availableProviders = aiClient.getAvailableProviders();
    const defaultProvider = aiClient.getDefaultProvider();
    
    console.log('Available providers:', availableProviders);
    console.log('Default provider:', defaultProvider);
    
    if (availableProviders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No AI providers configured',
        availableProviders: [],
        defaultProvider: null,
        error: 'AI_NOT_CONFIGURED',
        environment: {
          hasOpenAI: !!process.env.OPENAI_API_KEY,
          hasGrok: !!process.env.GROK_API_KEY,
          hasClaude: !!process.env.CLAUDE_API_KEY,
          hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
        }
      }, { status: 400 });
    }
    
    // Test topic generation
    try {
      console.log('Testing topic generation...');
      const topics = await aiClient.generateArticleTopics(2);
      console.log('✅ Topics generated:', topics);
      
      return NextResponse.json({
        success: true,
        message: 'AI client working properly',
        availableProviders,
        defaultProvider,
        testTopics: topics,
        environment: {
          hasOpenAI: !!process.env.OPENAI_API_KEY,
          hasGrok: !!process.env.GROK_API_KEY,
          hasClaude: !!process.env.CLAUDE_API_KEY,
          hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
        }
      });
    } catch (error) {
      console.error('❌ Error generating topics:', error);
      return NextResponse.json({
        success: false,
        message: 'AI client configured but failed to generate topics',
        availableProviders,
        defaultProvider,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          hasOpenAI: !!process.env.OPENAI_API_KEY,
          hasGrok: !!process.env.GROK_API_KEY,
          hasClaude: !!process.env.CLAUDE_API_KEY,
          hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
        }
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Test AI error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test AI client',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
