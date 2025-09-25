import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const availableProviders = aiClient.getAvailableProviders();
    const defaultProvider = aiClient.getDefaultProvider();
    
    if (!aiClient.isProviderAvailable('grok')) {
      return NextResponse.json({
        success: false,
        message: 'Grok API not configured',
        availableProviders,
        defaultProvider,
        error: 'GROK_NOT_CONFIGURED'
      }, { status: 400 });
    }

    // Test Grok API with a simple request
    try {
      const testResponse = await aiClient.generateContent(
        'Say "Grok is working perfectly!" if you can read this message.',
        'grok',
        50
      );
      
      return NextResponse.json({
        success: true,
        message: 'Grok API is working!',
        testResponse,
        provider: 'grok',
        availableProviders,
        defaultProvider
      });
    } catch (grokError) {
      return NextResponse.json({
        success: false,
        message: 'Grok API test failed',
        error: grokError instanceof Error ? grokError.message : 'Unknown error',
        provider: 'grok',
        availableProviders,
        defaultProvider
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Grok test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test Grok API',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
