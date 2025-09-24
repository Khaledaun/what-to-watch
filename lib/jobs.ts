import { db, Job, JobStatus } from './database'
import { 
  getTrendingMovies, 
  getTrendingTVShows, 
  getTopRatedMovies, 
  getTopRatedTVShows,
  getNowPlayingMovies,
  getOnTheAirTVShows,
  getMovieDetails,
  getTVShowDetails,
  getWatchProviders,
  getChanges,
  generateSlug
} from './tmdb-enhanced'
import { ArticleGenerationJobProcessor } from './article-generation-job'
import { env } from './env'

// Job types
export type JobType = 
  | 'seed_lists'
  | 'changes_scan'
  | 'hydrate_title'
  | 'refresh_providers'
  | 'build_factsheet'
  | 'twice_weekly_content_pack'
  | 'refresh_affiliates'
  | 'link_health_check'
  | 'ingest_news_feeds'
  | 'news_entity_linking'
  | 'generate_article_from_topic'

// Job payload types
export interface SeedListsPayload {
  countries: string[]
  timeWindow?: 'day' | 'week'
}

export interface ChangesScanPayload {
  type: 'movie' | 'tv'
  startDate?: string
  endDate?: string
}

export interface HydrateTitlePayload {
  tmdbId: number
  type: 'movie' | 'tv'
}

export interface RefreshProvidersPayload {
  titleIds?: string[]
  countries: string[]
}

export interface BuildFactsheetPayload {
  titleId: string
}

export interface ContentPackPayload {
  countries: string[]
  generateTop10: boolean
  generateHowTo: boolean
  generateComparison: boolean
}

export interface RefreshAffiliatesPayload {
  titleIds?: string[]
  countries: string[]
}

export interface LinkHealthCheckPayload {
  affiliateIds?: string[]
}

export interface IngestNewsFeedsPayload {
  feedIds?: string[]
}

export interface NewsEntityLinkingPayload {
  articleIds?: string[]
}

// Job execution functions
export class JobExecutor {
  private db = db

  async executeJob(job: Job): Promise<void> {
    const startTime = Date.now()
    
    try {
      await this.db.updateJob(job.id, {
        status: 'running',
        started_at: new Date().toISOString(),
        attempts: job.attempts + 1
      })

      await this.addJobLog(job.id, 'info', `Starting job: ${job.type}`)

      switch (job.type) {
        case 'seed_lists':
          await this.executeSeedLists(job.payload as SeedListsPayload)
          break
        case 'changes_scan':
          await this.executeChangesScan(job.payload as ChangesScanPayload)
          break
        case 'hydrate_title':
          await this.executeHydrateTitle(job.payload as HydrateTitlePayload)
          break
        case 'refresh_providers':
          await this.executeRefreshProviders(job.payload as RefreshProvidersPayload)
          break
        case 'build_factsheet':
          await this.executeBuildFactsheet(job.payload as BuildFactsheetPayload)
          break
        case 'twice_weekly_content_pack':
          await this.executeContentPack(job.payload as ContentPackPayload)
          break
        case 'refresh_affiliates':
          await this.executeRefreshAffiliates(job.payload as RefreshAffiliatesPayload)
          break
        case 'link_health_check':
          await this.executeLinkHealthCheck(job.payload as LinkHealthCheckPayload)
          break
        case 'ingest_news_feeds':
          await this.executeIngestNewsFeeds(job.payload as IngestNewsFeedsPayload)
          break
        case 'news_entity_linking':
          await this.executeNewsEntityLinking(job.payload as NewsEntityLinkingPayload)
          break
        case 'generate_article_from_topic':
          await this.executeGenerateArticleFromTopic(job.payload as any)
          break
        default:
          throw new Error(`Unknown job type: ${job.type}`)
      }

      const duration = Date.now() - startTime
      await this.db.updateJob(job.id, {
        status: 'done',
        finished_at: new Date().toISOString()
      })

      await this.addJobLog(job.id, 'info', `Job completed successfully in ${duration}ms`)

    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      await this.db.updateJob(job.id, {
        status: 'failed',
        error: errorMessage,
        finished_at: new Date().toISOString()
      })

      await this.addJobLog(job.id, 'error', `Job failed after ${duration}ms: ${errorMessage}`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      })

      throw error
    }
  }

  private async addJobLog(jobId: string, level: string, message: string, data?: any) {
    await this.db.addJobLog(jobId, level, message, data)
  }

  // Seed Lists Job
  private async executeSeedLists(payload: SeedListsPayload) {
    const { countries, timeWindow = 'week' } = payload
    
    for (const country of countries) {
      await this.addJobLog('', 'info', `Seeding lists for country: ${country}`)
      
      // Fetch trending movies
      const trendingMovies = await getTrendingMovies(timeWindow, 1, country)
      for (const movie of trendingMovies.results) {
        await this.upsertTitleFromTMDB(movie, 'movie')
      }
      
      // Fetch trending TV shows
      const trendingTVShows = await getTrendingTVShows(timeWindow, 1, country)
      for (const show of trendingTVShows.results) {
        await this.upsertTitleFromTMDB(show, 'tv')
      }
      
      // Fetch top rated movies
      const topRatedMovies = await getTopRatedMovies(1, country)
      for (const movie of topRatedMovies.results) {
        await this.upsertTitleFromTMDB(movie, 'movie')
      }
      
      // Fetch top rated TV shows
      const topRatedTVShows = await getTopRatedTVShows(1, country)
      for (const show of topRatedTVShows.results) {
        await this.upsertTitleFromTMDB(show, 'tv')
      }
      
      // Fetch now playing movies
      const nowPlayingMovies = await getNowPlayingMovies(1, country)
      for (const movie of nowPlayingMovies.results) {
        await this.upsertTitleFromTMDB(movie, 'movie')
      }
      
      // Fetch on the air TV shows
      const onTheAirTVShows = await getOnTheAirTVShows(1, country)
      for (const show of onTheAirTVShows.results) {
        await this.upsertTitleFromTMDB(show, 'tv')
      }
    }
  }

  // Changes Scan Job
  private async executeChangesScan(payload: ChangesScanPayload) {
    const { type, startDate, endDate } = payload
    
    const changes = await getChanges(type, startDate, endDate)
    
    for (const change of changes.results) {
      // Queue hydration job for each changed item
      await this.db.createJob({
        type: 'hydrate_title',
        payload: {
          tmdbId: change.id,
          type: type
        },
        status: 'queued',
        scheduled_for: new Date().toISOString()
      })
    }
    
    await this.addJobLog('', 'info', `Queued ${changes.results.length} titles for hydration`)
  }

  // Hydrate Title Job
  private async executeHydrateTitle(payload: HydrateTitlePayload) {
    const { tmdbId, type } = payload
    
    // Fetch detailed information
    const appendToResponse = [
      'external_ids',
      'credits',
      'keywords',
      'images',
      'videos',
      'watch/providers'
    ]
    
    if (type === 'movie') {
      appendToResponse.push('release_dates')
    } else {
      appendToResponse.push('content_ratings')
    }
    
    const details = type === 'movie' 
      ? await getMovieDetails(tmdbId, appendToResponse)
      : await getTVShowDetails(tmdbId, appendToResponse)
    
    // Update title with detailed information
    const titleData = {
      tmdb_id: tmdbId,
      type: type,
      slug: generateSlug(details.title || details.name, 
        new Date(details.release_date || details.first_air_date).getFullYear()),
      title: details.title || details.name,
      original_title: details.original_title || details.original_name,
      overview: details.overview,
      tagline: details.tagline,
      runtime: details.runtime,
      episode_count: details.number_of_episodes,
      season_count: details.number_of_seasons,
      release_date: details.release_date,
      first_air_date: details.first_air_date,
      last_air_date: details.last_air_date,
      status: details.status,
      popularity: details.popularity,
      vote_average: details.vote_average,
      vote_count: details.vote_count,
      adult: details.adult,
      original_language: details.original_language,
      genres: details.genres?.map((g: any) => g.id),
      production_countries: details.production_countries?.map((c: any) => c.iso_3166_1),
      spoken_languages: details.spoken_languages?.map((l: any) => l.iso_639_1),
      last_verified_at: new Date().toISOString()
    }
    
    const title = await this.db.upsertTitle(titleData)
    
    // Store raw snapshot
    await this.db.ensureClient().from('raw_snapshots').insert({
      title_id: title.id,
      endpoint: `${type}/${tmdbId}`,
      payload: details,
      hash: this.hashObject(details)
    })
    
    // Queue factsheet rebuild
    await this.db.createJob({
      type: 'build_factsheet',
      payload: { titleId: title.id },
      status: 'queued',
      scheduled_for: new Date().toISOString()
    })
  }

  // Refresh Providers Job
  private async executeRefreshProviders(payload: RefreshProvidersPayload) {
    const { titleIds, countries } = payload
    
    let titles
    if (titleIds) {
      titles = await this.db.ensureClient().from('titles').select('*').in('id', titleIds)
    } else {
      titles = await this.db.ensureClient().from('titles').select('*').limit(100)
    }
    
    for (const title of titles.data || []) {
      for (const country of countries) {
        try {
          const providers = await getWatchProviders(title.type, title.tmdb_id)
          const countryProviders = providers.results[country]
          
          if (countryProviders) {
            await this.db.upsertWatchProvider({
              title_id: title.id,
              country: country,
              flatrate: countryProviders.flatrate,
              rent: countryProviders.rent,
              buy: countryProviders.buy,
              link: countryProviders.link,
              fetched_at: new Date().toISOString()
            })
          }
        } catch (error) {
          await this.addJobLog('', 'warn', `Failed to fetch providers for ${title.title} in ${country}: ${error}`)
        }
      }
    }
  }

  // Build Factsheet Job
  private async executeBuildFactsheet(payload: BuildFactsheetPayload) {
    const { titleId } = payload
    
    const title = await this.db.ensureClient().from('titles').select('*').eq('id', titleId).single()
    if (!title.data) throw new Error(`Title not found: ${titleId}`)
    
    const factsheet = await this.buildFactsheet(title.data)
    
    await this.db.upsertFactsheet({
      title_id: titleId,
      curated_data: factsheet,
      last_verified_at: new Date().toISOString()
    })
  }

  // Content Pack Job
  private async executeContentPack(payload: ContentPackPayload) {
    const { countries, generateTop10, generateHowTo, generateComparison } = payload
    
    // This would integrate with content generation system
    // For now, just log the intent
    await this.addJobLog('', 'info', `Generating content pack for countries: ${countries.join(', ')}`)
  }

  // Refresh Affiliates Job
  private async executeRefreshAffiliates(payload: RefreshAffiliatesPayload) {
    const { titleIds, countries } = payload
    
    // Stub implementation - would integrate with affiliate APIs
    await this.addJobLog('', 'info', `Refreshing affiliates for ${titleIds?.length || 'all'} titles`)
  }

  // Link Health Check Job
  private async executeLinkHealthCheck(payload: LinkHealthCheckPayload) {
    const { affiliateIds } = payload
    
    // Stub implementation - would check link health
    await this.addJobLog('', 'info', `Checking health of ${affiliateIds?.length || 'all'} affiliate links`)
  }

  // Ingest News Feeds Job
  private async executeIngestNewsFeeds(payload: IngestNewsFeedsPayload) {
    const { feedIds } = payload
    
    // Stub implementation - would fetch RSS feeds
    await this.addJobLog('', 'info', `Ingesting news feeds: ${feedIds?.join(', ') || 'all'}`)
  }

  // News Entity Linking Job
  private async executeNewsEntityLinking(payload: NewsEntityLinkingPayload) {
    const { articleIds } = payload
    
    // Stub implementation - would link news articles to titles
    await this.addJobLog('', 'info', `Linking entities for ${articleIds?.length || 'all'} news articles`)
  }

  private async executeGenerateArticleFromTopic(payload: any) {
    const { topicId } = payload
    
    await this.addJobLog('', 'info', `Generating article from topic: ${topicId}`)
    
    const jobProcessor = new ArticleGenerationJobProcessor()
    const job = {
      id: '',
      type: 'generate_article_from_topic' as const,
      payload: { topicId, priority: 'medium' as const },
      status: 'running' as const,
      attempts: 0,
      scheduled_for: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await jobProcessor.processArticleGeneration(job)
  }

  // Helper methods
  private async upsertTitleFromTMDB(tmdbData: any, type: 'movie' | 'tv') {
    const titleData = {
      tmdb_id: tmdbData.id,
      type: type,
      slug: generateSlug(tmdbData.title || tmdbData.name, 
        new Date(tmdbData.release_date || tmdbData.first_air_date).getFullYear()),
      title: tmdbData.title || tmdbData.name,
      original_title: tmdbData.original_title || tmdbData.original_name,
      overview: tmdbData.overview,
      release_date: tmdbData.release_date,
      first_air_date: tmdbData.first_air_date,
      popularity: tmdbData.popularity,
      vote_average: tmdbData.vote_average,
      vote_count: tmdbData.vote_count,
      adult: tmdbData.adult,
      original_language: tmdbData.original_language,
      genres: tmdbData.genre_ids,
      last_verified_at: new Date().toISOString()
    }
    
    return this.db.upsertTitle(titleData)
  }

  private buildFactsheet(title: any): any {
    // Build curated factsheet data
    return {
      title: title.title,
      original_title: title.original_title,
      overview: title.overview,
      release_date: title.release_date || title.first_air_date,
      runtime: title.runtime,
      genres: title.genres,
      rating: title.vote_average,
      vote_count: title.vote_count,
      popularity: title.popularity,
      type: title.type,
      slug: title.slug,
      last_updated: new Date().toISOString()
    }
  }

  private hashObject(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString('base64')
  }
}

// Job scheduler
export class JobScheduler {
  private db = db
  private executor = new JobExecutor()

  async scheduleJob(type: JobType, payload: any, scheduledFor?: Date) {
    return this.db.createJob({
      type,
      payload,
      status: 'queued',
      scheduled_for: scheduledFor?.toISOString() || new Date().toISOString()
    })
  }

  async processJobQueue() {
    console.log('Starting job queue processing...')
    
    const { data: jobs, error } = await this.db.ensureClient()
      .from('jobs')
      .select('*')
      .eq('status', 'queued')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for', { ascending: true })
      .limit(10)

    if (error) {
      console.error('Error fetching jobs:', error)
      return { processed: 0, error }
    }

    if (!jobs || jobs.length === 0) {
      console.log('No jobs to process')
      return { processed: 0 }
    }

    console.log(`Processing ${jobs.length} jobs...`)

    let processed = 0
    for (const job of jobs) {
      try {
        console.log(`Processing job ${job.id} (${job.type})`)
        await this.executor.executeJob(job)
        processed++
        console.log(`Job ${job.id} completed successfully`)
      } catch (error) {
        console.error(`Job ${job.id} failed:`, error)
      }
    }

    console.log(`Processed ${processed} jobs`)
    return { processed }
  }
}

// Export singleton instances
export const jobExecutor = new JobExecutor()
export const jobScheduler = new JobScheduler()
