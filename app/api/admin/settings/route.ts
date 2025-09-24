import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const client = db.ensureClient();
    
    if (!client) {
      // Return environment variables as settings when database is not available
      return NextResponse.json({
        settings: {
          openaiApiKey: process.env.OPENAI_API_KEY || process.env.GROK_API_KEY || '',
          contentGenerationEnabled: process.env.CONTENT_GENERATION_ENABLED === 'true',
          tmdbApiKey: process.env.TMDB_API_KEY || '',
          siteRegionDefault: process.env.NEXT_PUBLIC_SITE_REGION_DEFAULT || 'US',
          regionFallback: process.env.REGION_FALLBACK || 'CA',
          supabaseUrl: process.env.SUPABASE_URL || '',
          supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          siteBrandName: process.env.SITE_BRAND_NAME || 'What to Watch',
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          nextPublicGaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
          googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
          amazonAssociateTag: process.env.AMAZON_ASSOCIATE_TAG || '',
          cjPublisherId: process.env.CJ_PUBLISHER_ID || '',
          flexoffersApiKey: process.env.FLEXOFFERS_API_KEY || '',
        }
      });
    }

    // Fetch settings from database
    const { data: settings, error } = await client
      .from('settings')
      .select('*');

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Convert settings array to object
    const settingsObj = settings?.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {}) || {};

    return NextResponse.json({ settings: settingsObj });

  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch settings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/admin/settings - Update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    const client = db.ensureClient();
    
    if (!client) {
      return NextResponse.json({ 
        error: 'Database not available',
        message: 'Settings cannot be saved without database connection'
      }, { status: 503 });
    }

    // Update settings in database
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    const { error } = await client
      .from('settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      updated: Object.keys(settings).length
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({
      error: 'Failed to update settings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
