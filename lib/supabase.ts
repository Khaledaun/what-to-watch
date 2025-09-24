import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create clients only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side client with service role key
export const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

// Database types (you can generate these from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_platforms: string[]
          preferred_moods: string[]
          preferred_time_budget: string
          preferred_audience: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_platforms?: string[]
          preferred_moods?: string[]
          preferred_time_budget?: string
          preferred_audience?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_platforms?: string[]
          preferred_moods?: string[]
          preferred_time_budget?: string
          preferred_audience?: string
          created_at?: string
          updated_at?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          movie_id: string
          movie_title: string
          movie_type: 'movie' | 'series'
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: string
          movie_title: string
          movie_type: 'movie' | 'series'
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: string
          movie_title?: string
          movie_type?: 'movie' | 'series'
          added_at?: string
        }
      }
      recommendations_history: {
        Row: {
          id: string
          user_id: string
          filters: any
          recommendations: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          filters: any
          recommendations: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filters?: any
          recommendations?: any
          created_at?: string
        }
      }
    }
  }
}
