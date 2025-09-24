import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Database client
export const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null

// Database types (matching the schema)
export type TitleType = 'movie' | 'tv'
export type ContentKind = 'article' | 'top' | 'comparison' | 'howto' | 'news_digest'
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'
export type JobStatus = 'queued' | 'running' | 'done' | 'failed'
export type AdminRole = 'owner' | 'editor' | 'analyst'
export type NewsStatus = 'queued' | 'approved' | 'rejected'
export type SourceType = 'rss' | 'manual'

export interface Title {
  id: string
  tmdb_id: number
  type: TitleType
  slug: string
  title: string
  original_title?: string
  overview?: string
  tagline?: string
  runtime?: number
  episode_count?: number
  season_count?: number
  release_date?: string
  first_air_date?: string
  last_air_date?: string
  status?: string
  popularity?: number
  vote_average?: number
  vote_count?: number
  adult: boolean
  original_language?: string
  genres?: number[]
  production_countries?: string[]
  spoken_languages?: string[]
  created_at: string
  updated_at: string
  last_verified_at: string
}

export interface ExternalIds {
  title_id: string
  imdb_id?: string
  tvdb_id?: number
  facebook_id?: string
  instagram_id?: string
  twitter_id?: string
}

export interface Person {
  id: string
  tmdb_id: number
  name: string
  also_known_as?: string[]
  biography?: string
  birthday?: string
  deathday?: string
  place_of_birth?: string
  profile_path?: string
  popularity?: number
  adult: boolean
  created_at: string
  updated_at: string
}

export interface CreditsPerson {
  id: string
  title_id: string
  person_id: string
  character?: string
  job?: string
  department?: string
  order_index?: number
  created_at: string
}

export interface Image {
  id: string
  title_id: string
  file_path: string
  aspect_ratio?: number
  height?: number
  width?: number
  vote_average?: number
  vote_count?: number
  image_type: string
  created_at: string
}

export interface Video {
  id: string
  title_id: string
  key: string
  name?: string
  site: string
  size?: number
  type: string
  official: boolean
  published_at?: string
  created_at: string
}

export interface Keyword {
  id: string
  tmdb_id: number
  name: string
  created_at: string
}

export interface TitleKeyword {
  title_id: string
  keyword_id: string
}

export interface WatchProvider {
  id: string
  title_id: string
  country: string
  flatrate?: any[]
  rent?: any[]
  buy?: any[]
  link?: string
  fetched_at: string
}

export interface RawSnapshot {
  id: string
  title_id: string
  endpoint: string
  payload: any
  fetched_at: string
  hash: string
}

export interface Factsheet {
  id: string
  title_id: string
  curated_data: any
  locked_fields: any
  last_verified_at: string
  created_at: string
  updated_at: string
}

export interface ContentTemplate {
  id: string
  kind: ContentKind
  name: string
  template_md?: string
  template_blocks?: any
  active: boolean
  created_at: string
  updated_at: string
}

export interface ContentItem {
  id: string
  kind: ContentKind
  title_id?: string
  slug: string
  country: string
  language: string
  status: ContentStatus
  scheduled_for?: string
  published_at?: string
  seo_jsonld?: any
  body_md?: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface ContentRun {
  id: string
  trigger: string
  run_at: string
  status: string
  metrics?: any
  initiated_by: string
  created_at: string
}

export interface NewsFeed {
  id: string
  name: string
  source_type: SourceType
  url?: string
  country?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  source: string
  url: string
  title: string
  summary?: string
  published_at?: string
  country: string
  entities?: any
  keywords?: string[]
  status: NewsStatus
  created_at: string
  created_by?: string
}

export interface AffiliateProvider {
  id: string
  name: string
  active: boolean
  resolver_strategy?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Affiliate {
  id: string
  title_id: string
  country: string
  provider: string
  url?: string
  expires_at?: string
  last_checked_at: string
  meta?: any
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  active: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  type: string
  payload?: any
  status: JobStatus
  attempts: number
  error?: string
  scheduled_for: string
  started_at?: string
  finished_at?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface JobLog {
  id: string
  job_id: string
  ts: string
  level: string
  message: string
  data?: any
}

export interface Setting {
  key: string
  value: any
  updated_at: string
}

export interface AuditLog {
  id: string
  actor_email: string
  action: string
  entity: string
  entity_id?: string
  diff?: any
  ts: string
}

// Database helper functions
export class DatabaseClient {
  public client = supabase

  public ensureClient() {
    if (!this.client) {
      // Return null if Supabase is not configured (for development/testing)
      console.warn('Supabase client not initialized. Running without database.');
      return null as any;
    }
    return this.client;
  }

  // Titles
  async getTitles(filters?: {
    type?: TitleType
    year?: number
    genre?: number
    limit?: number
    offset?: number
  }) {
    const client = this.ensureClient();
    if (!client) {
      return { data: [], error: null };
    }
    
    let query = client.from('titles').select('*')
    
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters?.year) {
      query = query.gte('release_date', `${filters.year}-01-01`)
      query = query.lte('release_date', `${filters.year}-12-31`)
    }
    
    if (filters?.genre) {
      query = query.contains('genres', [filters.genre])
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }
    
    return query.order('popularity', { ascending: false })
  }

  async getTitleByTmdbId(tmdbId: number) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('titles')
      .select('*')
      .eq('tmdb_id', tmdbId)
      .single()
    
    if (error) throw error
    return data as Title
  }

  async getTitleBySlug(slug: string) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('titles')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data as Title
  }

  async upsertTitle(title: Partial<Title>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('titles')
      .upsert(title, { onConflict: 'tmdb_id' })
      .select()
      .single()
    
    if (error) throw error
    return data as Title
  }

  // Factsheets
  async getFactsheet(titleId: string) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('factsheets')
      .select('*')
      .eq('title_id', titleId)
      .single()
    
    if (error) throw error
    return data as Factsheet
  }

  async upsertFactsheet(factsheet: Partial<Factsheet>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('factsheets')
      .upsert(factsheet, { onConflict: 'title_id' })
      .select()
      .single()
    
    if (error) throw error
    return data as Factsheet
  }

  // Watch Providers
  async getWatchProviders(titleId: string, country: string) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('watch_providers')
      .select('*')
      .eq('title_id', titleId)
      .eq('country', country)
      .single()
    
    if (error) throw error
    return data as WatchProvider
  }

  async upsertWatchProvider(provider: Partial<WatchProvider>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('watch_providers')
      .upsert(provider, { onConflict: 'title_id,country' })
      .select()
      .single()
    
    if (error) throw error
    return data as WatchProvider
  }

  // Jobs
  async createJob(job: Partial<Job>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('jobs')
      .insert(job)
      .select()
      .single()
    
    if (error) throw error
    return data as Job
  }

  async updateJob(jobId: string, updates: Partial<Job>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single()
    
    if (error) throw error
    return data as Job
  }

  async getJobs(filters?: {
    status?: JobStatus
    type?: string
    limit?: number
  }) {
    const client = this.ensureClient();
    let query = client.from('jobs').select('*')
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    return query.order('created_at', { ascending: false })
  }

  async addJobLog(jobId: string, level: string, message: string, data?: any) {
    const client = this.ensureClient();
    const { data: logData, error } = await client
      .from('job_logs')
      .insert({
        job_id: jobId,
        level,
        message,
        data
      })
      .select()
      .single()
    
    if (error) throw error
    return logData as JobLog
  }

  // Content
  async getContentItems(filters?: {
    status?: ContentStatus
    kind?: ContentKind
    country?: string
    limit?: number
  }) {
    const client = this.ensureClient();
    let query = client.from('content_items').select('*')
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.kind) {
      query = query.eq('kind', filters.kind)
    }
    
    if (filters?.country) {
      query = query.eq('country', filters.country)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    return query.order('created_at', { ascending: false })
  }

  async createContentItem(content: Partial<ContentItem>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('content_items')
      .insert(content)
      .select()
      .single()
    
    if (error) throw error
    return data as ContentItem
  }

  async updateContentItem(id: string, updates: Partial<ContentItem>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as ContentItem
  }

  // Settings
  async getSetting(key: string) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('settings')
      .select('*')
      .eq('key', key)
      .single()
    
    if (error) throw error
    return data as Setting
  }

  async setSetting(key: string, value: any) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })
      .select()
      .single()
    
    if (error) throw error
    return data as Setting
  }

  // Audit
  async addAuditLog(log: Partial<AuditLog>) {
    const client = this.ensureClient();
    const { data, error } = await client
      .from('audit_logs')
      .insert(log)
      .select()
      .single()
    
    if (error) throw error
    return data as AuditLog
  }
}

// Export singleton instance
export const db = new DatabaseClient()
