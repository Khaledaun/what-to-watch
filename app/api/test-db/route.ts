import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');
    
    const client = db.ensureClient();
    
    if (!client) {
      return NextResponse.json({
        success: false,
        message: 'Database client not available',
        error: 'NO_DATABASE_CLIENT',
        environment: {
          hasSupabaseUrl: !!process.env.SUPABASE_URL,
          hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }
      }, { status: 400 });
    }

    // Test a simple query
    try {
      const { data, error } = await client
        .from('jobs')
        .select('count')
        .limit(1);

      if (error) {
        console.error('❌ Database query error:', error);
        return NextResponse.json({
          success: false,
          message: 'Database query failed',
          error: error.message,
          environment: {
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          }
        }, { status: 500 });
      }

      console.log('✅ Database connection successful');
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        queryResult: data,
        environment: {
          hasSupabaseUrl: !!process.env.SUPABASE_URL,
          hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }
      });

    } catch (queryError) {
      console.error('❌ Database query exception:', queryError);
      return NextResponse.json({
        success: false,
        message: 'Database query exception',
        error: queryError instanceof Error ? queryError.message : 'Unknown error',
        environment: {
          hasSupabaseUrl: !!process.env.SUPABASE_URL,
          hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
