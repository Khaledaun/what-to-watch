import { NextRequest, NextResponse } from 'next/server';
import { aiClient } from '@/lib/ai-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const availableProviders = aiClient.getAvailableProviders();
    const defaultProvider = aiClient.getDefaultProvider();
    
    // Test each provider with a simple request
    const providerStatus = await Promise.all(
      availableProviders.map(async (provider) => {
        try {
          const testResponse = await aiClient.generateContent(
            'Say "AI is working" if you can read this.',
            provider,
            10
          );
          return {
            name: provider,
            status: 'connected',
            testResponse: testResponse.substring(0, 50) + '...'
          };
        } catch (error) {
          return {
            name: provider,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      availableProviders,
      defaultProvider,
      providerStatus,
      totalProviders: availableProviders.length,
      workingProviders: providerStatus.filter(p => p.status === 'connected').length
    });

  } catch (error) {
    console.error('AI Status API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check AI status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
