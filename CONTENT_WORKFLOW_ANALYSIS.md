# 🎬 Complete Content Creation Workflow Analysis

## 📋 **Executive Summary**

This document provides a detailed analysis of the complete content creation workflow in the YallaCinema system, from TMDB data ingestion to published articles. The system follows a sophisticated pipeline: **Ingest → Normalize → Curate → Generate → Approve → Publish**.

---

## 1. 🎯 **TMDB Data Ingestion**

### **Endpoints and Fields We Pull from TMDB**

#### **Discovery Endpoints (Seed Lists)**
```typescript
// Trending Content
GET /trending/movie/week?region=US&page=1
GET /trending/tv/week?region=US&page=1

// Top Rated Content  
GET /movie/top_rated?region=US&page=1
GET /tv/top_rated?region=US&page=1

// Currently Available
GET /movie/now_playing?region=US&page=1
GET /tv/on_the_air?region=US&page=1
```

**Fields Extracted:**
- `id`, `title/name`, `original_title/name`
- `release_date/first_air_date`, `poster_path`, `backdrop_path`
- `overview`, `vote_average`, `vote_count`, `popularity`
- `genre_ids`, `adult`, `original_language`, `video`

#### **Detailed Content Endpoints (Hydration)**
```typescript
// Movie Details
GET /movie/{id}?append_to_response=external_ids,credits,keywords,images,videos,watch/providers,release_dates

// TV Show Details  
GET /tv/{id}?append_to_response=external_ids,credits,keywords,images,videos,watch/providers,content_ratings
```

**Additional Fields:**
- `tagline`, `runtime`, `number_of_episodes/seasons`
- `status`, `last_air_date`, `production_countries`
- `spoken_languages`, `homepage`, `budget`, `revenue`

#### **Watch Providers**
```typescript
GET /movie/{id}/watch/providers
GET /tv/{id}/watch/providers
```

**Fields:**
- `flatrate`, `rent`, `buy` arrays with provider details
- `link` for regional streaming information

#### **Changes Detection**
```typescript
GET /movie/changes?start_date=2024-01-01&end_date=2024-01-02
GET /tv/changes?start_date=2024-01-01&end_date=2024-01-02
```

### **Rate Limiting, Retries, and Error Handling**

#### **Rate Limiting Implementation**
```typescript
// 250ms delay between requests
const RATE_LIMIT_DELAY = 250
const lastRequestTime = 0

async function rateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => 
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    )
  }
  lastRequestTime = Date.now()
}
```

#### **Retry Strategy**
```typescript
// Exponential backoff with jitter
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // base delay
const JITTER_FACTOR = 0.1 // 10% jitter

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (error) {
      // Don't retry on 4xx errors except 429 (rate limit)
      if (status >= 400 && status < 500 && status !== 429) {
        throw error
      }
      
      if (attempt === MAX_RETRIES) throw error
      
      // Exponential backoff with jitter
      const delay = RETRY_DELAY * Math.pow(2, attempt)
      const jitter = delay * JITTER_FACTOR * Math.random()
      await new Promise(resolve => setTimeout(resolve, delay + jitter))
    }
  }
}
```

#### **Error Handling**
- **Client Errors (4xx)**: Not retried except 429 (rate limit)
- **Server Errors (5xx)**: Retried with exponential backoff
- **Network Errors**: Retried with exponential backoff
- **Validation Errors**: Zod schema validation with detailed error messages

### **Raw Data Normalization**

#### **Raw Snapshots Storage**
```sql
CREATE TABLE raw_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    payload JSONB NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    hash TEXT NOT NULL
);
```

**Purpose:**
- Store complete TMDB API responses for debugging
- Enable data lineage and audit trails
- Support rollback scenarios
- Cache expensive API calls

---

## 2. 🗄️ **Database Usage & Schema Mapping**

### **Core Tables and Relationships**

#### **Titles Table (Primary Content)**
```sql
CREATE TABLE titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    type title_type NOT NULL, -- 'movie' | 'tv'
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    tagline TEXT,
    runtime INTEGER,
    episode_count INTEGER,
    season_count INTEGER,
    release_date DATE,
    first_air_date DATE,
    last_air_date DATE,
    status TEXT,
    popularity DECIMAL(10,2),
    vote_average DECIMAL(3,1),
    vote_count INTEGER,
    adult BOOLEAN DEFAULT false,
    original_language TEXT,
    genres INTEGER[], -- TMDB genre IDs
    production_countries TEXT[],
    spoken_languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Supporting Tables**
```sql
-- External IDs (IMDB, TVDB, etc.)
CREATE TABLE external_ids (
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    imdb_id TEXT,
    tvdb_id INTEGER,
    facebook_id TEXT,
    instagram_id TEXT,
    twitter_id TEXT,
    PRIMARY KEY (title_id)
);

-- People (Cast & Crew)
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    also_known_as TEXT[],
    biography TEXT,
    birthday DATE,
    deathday DATE,
    place_of_birth TEXT,
    profile_path TEXT,
    popularity DECIMAL(10,2),
    adult BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credits (Cast & Crew relationships)
CREATE TABLE credits_people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE CASCADE,
    character TEXT,
    job TEXT,
    department TEXT,
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images (Posters, Backdrops, etc.)
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    aspect_ratio DECIMAL(5,2),
    height INTEGER,
    width INTEGER,
    vote_average DECIMAL(3,1),
    vote_count INTEGER,
    image_type TEXT NOT NULL, -- 'poster', 'backdrop', 'logo', 'still'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos (Trailers, Featurettes, etc.)
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    name TEXT,
    site TEXT NOT NULL, -- 'YouTube', 'Vimeo'
    size INTEGER,
    type TEXT NOT NULL, -- 'Trailer', 'Teaser', 'Clip'
    official BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keywords
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE title_keywords (
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, keyword_id)
);

-- Watch Providers (Streaming availability)
CREATE TABLE watch_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    flatrate JSONB, -- Streaming services
    rent JSONB,     -- Rental services  
    buy JSONB,      -- Purchase services
    link TEXT,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (title_id, country)
);
```

### **Content System Tables**

#### **Factsheets (Curated Content)**
```sql
CREATE TABLE factsheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    curated_data JSONB NOT NULL,
    locked_fields JSONB DEFAULT '{}',
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (title_id)
);
```

**Factsheet Structure:**
```json
{
  "summary": "AI-generated summary of the title",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "why_watch": "Compelling reason to watch",
  "target_audience": "family|adult|teen",
  "mood_tags": ["action", "comedy", "drama"],
  "similar_titles": ["title1", "title2"],
  "trivia": ["Interesting fact 1", "Interesting fact 2"],
  "awards": ["Oscar Winner", "Golden Globe Nominee"],
  "critical_reception": {
    "consensus": "Generally positive",
    "highlights": ["Great acting", "Beautiful cinematography"]
  }
}
```

#### **Content Items (Articles)**
```sql
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kind content_kind NOT NULL, -- 'article' | 'top' | 'comparison' | 'howto' | 'news_digest'
    title_id UUID REFERENCES titles(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    language TEXT NOT NULL DEFAULT 'en-US',
    status content_status NOT NULL DEFAULT 'draft', -- 'draft' | 'scheduled' | 'published' | 'archived'
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    seo_jsonld JSONB,
    body_md TEXT,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (slug, country, language)
);
```

### **RLS Policies and Indexes**

#### **Row Level Security**
```sql
-- Public read access for titles
CREATE POLICY "Public can read titles" ON titles FOR SELECT USING (true);

-- Public read access for factsheets  
CREATE POLICY "Public can read factsheets" ON factsheets FOR SELECT USING (true);

-- Public read access for published content
CREATE POLICY "Public can read published content" ON content_items 
FOR SELECT USING (status = 'published');

-- Admin-only access for management tables
CREATE POLICY "Admin only access" ON jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin only access" ON settings FOR ALL USING (auth.role() = 'service_role');
```

#### **Performance Indexes**
```sql
-- Core performance indexes
CREATE INDEX idx_titles_type_year ON titles(type, EXTRACT(YEAR FROM COALESCE(release_date, first_air_date)));
CREATE INDEX idx_titles_popularity ON titles(popularity DESC);
CREATE INDEX idx_titles_vote_average ON titles(vote_average DESC);
CREATE INDEX idx_titles_slug ON titles(slug);

-- Content indexes
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_published_at ON content_items(published_at DESC);
CREATE INDEX idx_content_items_scheduled_for ON content_items(scheduled_for);

-- Job system indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_for ON jobs(scheduled_for);
CREATE INDEX idx_jobs_type ON jobs(type);
```

---

## 3. 🔄 **Content Workflow Pipeline**

### **Stage 1: Ingest (TMDB Data Collection)**

#### **Seed Lists Job**
```typescript
async executeSeedLists(payload: SeedListsPayload) {
  const { countries, timeWindow } = payload
  
  for (const country of countries) {
    // Fetch trending content
    const [trendingMovies, trendingTV, topMovies, topTV] = await Promise.all([
      getTrendingMovies(timeWindow, 1, country),
      getTrendingTVShows(timeWindow, 1, country), 
      getTopRatedMovies(1, country),
      getTopRatedTVShows(1, country)
    ])
    
    // Queue titles for hydration
    const allTitles = [
      ...trendingMovies.results,
      ...trendingTV.results,
      ...topMovies.results,
      ...topTV.results
    ]
    
    for (const title of allTitles) {
      await this.db.createJob({
        type: 'hydrate_title',
        payload: { tmdbId: title.id, type: title.media_type }
      })
    }
  }
}
```

**Data Flow:**
- **Input**: Countries array, time window
- **Process**: Fetch trending/top-rated content from TMDB
- **Output**: Queue hydration jobs for detailed data collection
- **Storage**: Jobs table with `hydrate_title` type

#### **Changes Scan Job**
```typescript
async executeChangesScan(payload: ChangesScanPayload) {
  const { startDate, endDate } = payload
  
  const [movieChanges, tvChanges] = await Promise.all([
    getChanges('movie', startDate, endDate),
    getChanges('tv', startDate, endDate)
  ])
  
  // Queue updated titles for re-hydration
  const allChanges = [...movieChanges.results, ...tvChanges.results]
  
  for (const change of allChanges) {
    await this.db.createJob({
      type: 'hydrate_title', 
      payload: { tmdbId: change.id, type: change.media_type }
    })
  }
}
```

**Data Flow:**
- **Input**: Date range for change detection
- **Process**: Check TMDB changes API for updated content
- **Output**: Queue re-hydration jobs for modified titles
- **Storage**: Jobs table with updated titles

### **Stage 2: Normalize (Data Processing)**

#### **Hydrate Title Job**
```typescript
async executeHydrateTitle(payload: HydrateTitlePayload) {
  const { tmdbId, type } = payload
  
  // Fetch comprehensive data
  const appendToResponse = [
    'external_ids', 'credits', 'keywords', 
    'images', 'videos', 'watch/providers'
  ]
  
  if (type === 'movie') {
    appendToResponse.push('release_dates')
  } else {
    appendToResponse.push('content_ratings')
  }
  
  const details = type === 'movie' 
    ? await getMovieDetails(tmdbId, appendToResponse)
    : await getTVShowDetails(tmdbId, appendToResponse)
  
  // Normalize and store data
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
  await this.db.createRawSnapshot({
    title_id: title.id,
    endpoint: `${type}/${tmdbId}`,
    payload: details,
    hash: this.generateHash(details)
  })
  
  // Store related data
  await this.storeExternalIds(title.id, details.external_ids)
  await this.storeCredits(title.id, details.credits)
  await this.storeImages(title.id, details.images)
  await this.storeVideos(title.id, details.videos)
  await this.storeKeywords(title.id, details.keywords)
  await this.storeWatchProviders(title.id, details['watch/providers'])
  
  // Queue factsheet generation
  await this.db.createJob({
    type: 'build_factsheet',
    payload: { titleId: title.id }
  })
}
```

**Data Flow:**
- **Input**: TMDB ID and content type
- **Process**: Fetch comprehensive details, normalize data structure
- **Output**: Populate all related tables (titles, people, images, etc.)
- **Storage**: Multiple tables with foreign key relationships

### **Stage 3: Curate (Factsheet Generation)**

#### **Build Factsheet Job**
```typescript
async executeBuildFactsheet(payload: BuildFactsheetPayload) {
  const { titleId } = payload
  
  // Get title and related data
  const title = await this.db.getTitleWithRelations(titleId)
  
  // Generate AI-curated content
  const curatedData = await this.generateFactsheetContent(title)
  
  // Store factsheet
  await this.db.upsertFactsheet({
    title_id: titleId,
    curated_data: curatedData,
    last_verified_at: new Date().toISOString()
  })
}
```

**Factsheet Generation Process:**
1. **Data Aggregation**: Collect title, cast, crew, reviews, ratings
2. **AI Processing**: Generate summary, key points, target audience
3. **Content Curation**: Create compelling "why watch" descriptions
4. **Metadata Enhancement**: Add mood tags, similar titles, trivia
5. **Storage**: Save to factsheets table with JSONB structure

### **Stage 4: Generate (Content Creation)**

#### **Content Generation Templates**

##### **Top 10 Movies Template**
```typescript
const top10_movies = {
  title: 'Top 10 {{genre}} Movies to Watch {{country}}',
  template: `# Top 10 {{genre}} Movies to Watch {{country}}

Discover the best {{genre.toLowerCase()}} movies available to stream right now. Our curated list features the highest-rated films that are perfect for your next movie night.

{{#each movies}}
## {{@index}}. {{title}} ({{year}})
{{overview}}

**Where to watch:** {{providers}}
**Runtime:** {{runtime}} minutes
**Rating:** {{rating}}/10

{{/each}}

## How We Choose Our Recommendations

Our recommendations are based on:
- **Critical acclaim** from both audiences and critics
- **Availability** on major streaming platforms
- **Recent releases** and timeless classics
- **Genre diversity** to suit different tastes

*Last updated: {{date}}*
*Data provided by TMDB API*`
}
```

##### **How-to Watch Template**
```typescript
const how_to_watch = {
  title: 'How to Watch {{title}} ({{year}})',
  template: `# How to Watch {{title}} ({{year}})

{{overview}}

## Where to Stream {{title}}

{{#each providers}}
### {{name}}
{{url}}
{{/each}}

## Cast & Crew

{{#each cast}}
- **{{name}}** as {{character}}
{{/each}}

## About {{title}}

{{overview}}

**Release Date:** {{release_date}}
**Runtime:** {{runtime}} minutes
**Genre:** {{genres}}
**Rating:** {{rating}}/10

## Similar Recommendations

If you enjoyed {{title}}, you might also like:
- [Similar Movie 1]
- [Similar Movie 2]
- [Similar Movie 3]

*Last updated: {{date}}*
*Data provided by TMDB API*`
}
```

#### **Content Generation Process**
```typescript
async generateTop10Content(type: 'movie' | 'tv', genre: string, country: string) {
  // Get top-rated titles for the genre and country
  const { data: titles } = await this.db.ensureClient()
    .from('titles')
    .select(`
      *,
      factsheets!inner(curated_data),
      watch_providers!inner(flatrate, rent, buy)
    `)
    .eq('type', type)
    .contains('genres', [this.getGenreId(genre)])
    .eq('watch_providers.country', country)
    .order('vote_average', { ascending: false })
    .limit(10);

  const template = type === 'movie' ? CONTENT_TEMPLATES.top10_movies : CONTENT_TEMPLATES.top10_tv;
  
  return this.renderTemplate(template.template, {
    genre,
    country,
    [type === 'movie' ? 'movies' : 'shows']: titles.map(title => ({
      title: title.title,
      year: new Date(title.release_date || title.first_air_date).getFullYear(),
      overview: title.overview,
      providers: this.formatProviders(title.watch_providers),
      runtime: title.runtime,
      rating: title.vote_average,
      seasons: title.season_count,
      episodes: title.episode_count
    })),
    date: new Date().toLocaleDateString()
  });
}
```

**Data Flow:**
- **Input**: Content type, genre, country parameters
- **Process**: Query factsheets, apply Handlebars-like templating
- **Output**: Generated markdown content with embedded data
- **Storage**: Content items table with `draft` status

### **Stage 5: Approve (Content Review)**

#### **Content Review Process**
```typescript
// Admin reviews generated content
async reviewContent(contentId: string, action: 'approve' | 'reject', edits?: any) {
  const content = await this.db.getContentItem(contentId)
  
  if (action === 'approve') {
    // Apply any edits made by admin
    if (edits) {
      await this.db.updateContentItem(contentId, {
        body_md: edits.body_md,
        seo_jsonld: edits.seo_jsonld,
        updated_by: 'admin'
      })
    }
    
    // Schedule for publishing
    await this.db.updateContentItem(contentId, {
      status: 'scheduled',
      scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    })
  } else {
    // Reject and archive
    await this.db.updateContentItem(contentId, {
      status: 'archived',
      updated_by: 'admin'
    })
  }
}
```

**Data Flow:**
- **Input**: Content ID, approval decision, optional edits
- **Process**: Update content status and metadata
- **Output**: Content marked as scheduled or archived
- **Storage**: Content items table with updated status

### **Stage 6: Publish (Content Deployment)**

#### **Publishing Process**
```typescript
async publishContent(contentId: string) {
  const content = await this.db.getContentItem(contentId)
  
  // Generate SEO metadata
  const seoData = await this.generateSEOData(content)
  
  // Update content with final metadata
  await this.db.updateContentItem(contentId, {
    status: 'published',
    published_at: new Date().toISOString(),
    seo_jsonld: seoData,
    updated_by: 'system'
  })
  
  // Create public page
  await this.createPublicPage(content)
}
```

**SEO Data Generation:**
```typescript
async generateSEOData(content: ContentItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.title,
    "description": content.description,
    "datePublished": content.published_at,
    "author": {
      "@type": "Organization",
      "name": "YallaCinema"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "YallaCinema",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yallacinema.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://yallacinema.com/${content.slug}`
    }
  }
}
```

**Data Flow:**
- **Input**: Approved content item
- **Process**: Generate SEO metadata, create public page
- **Output**: Published article with full SEO optimization
- **Storage**: Content items table with `published` status

---

## 4. 🎨 **Content Generation System**

### **AI Template System**

#### **Template Types**
1. **Top 10 Lists**: Movies/TV shows by genre and country
2. **How-to Guides**: Streaming instructions for specific titles  
3. **Comparisons**: Head-to-head title comparisons
4. **News Digests**: Weekly roundups by genre/country

#### **Template Rendering Engine**
```typescript
class TemplateRenderer {
  renderTemplate(template: string, data: any): string {
    // Handlebars-like templating
    return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      return this.evaluateExpression(expression, data)
    })
  }
  
  evaluateExpression(expression: string, data: any): string {
    // Handle loops, conditionals, and data access
    if (expression.includes('#each')) {
      return this.handleLoop(expression, data)
    }
    if (expression.includes('if')) {
      return this.handleConditional(expression, data)
    }
    return this.getNestedValue(expression, data)
  }
}
```

### **SEO Integration**

#### **JSON-LD Structured Data**
```typescript
const seoJsonld = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Top 10 Action Movies to Watch in US",
  "description": "Discover the best action movies available to stream right now...",
  "datePublished": "2024-01-15T10:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "YallaCinema"
  },
  "publisher": {
    "@type": "Organization",
    "name": "YallaCinema"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://yallacinema.com/top-10-action-movies-us"
  }
}
```

#### **Meta Tags Generation**
```typescript
const metaTags = {
  title: "Top 10 Action Movies to Watch in US | YallaCinema",
  description: "Discover the best action movies available to stream right now...",
  keywords: "action movies, streaming, Netflix, Prime Video, top movies",
  canonical: "https://yallacinema.com/top-10-action-movies-us",
  openGraph: {
    title: "Top 10 Action Movies to Watch in US",
    description: "Discover the best action movies available to stream right now...",
    image: "https://yallacinema.com/og-images/top-10-action-movies.jpg",
    url: "https://yallacinema.com/top-10-action-movies-us"
  }
}
```

### **Content Status Workflow**

#### **Status Transitions**
```typescript
type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'

// Draft → Scheduled (Admin approval)
// Scheduled → Published (Automated publishing)
// Any status → Archived (Admin rejection or cleanup)
```

#### **Automated Publishing**
```typescript
async processScheduledContent() {
  const scheduledContent = await this.db.ensureClient()
    .from('content_items')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', new Date().toISOString())
  
  for (const content of scheduledContent) {
    await this.publishContent(content.id)
  }
}
```

---

## 5. 🎛️ **Admin Dashboard Integration**

### **Dashboard Tabs and Workflow Mapping**

#### **TMDB Ingest Tab**
- **Configuration**: View TMDB API settings and rate limits
- **Discovery**: Run seed lists jobs for content discovery
- **Changes**: Monitor and run changes scan jobs
- **Hydration Queue**: View titles waiting for detailed data collection

#### **Titles & Factsheets Tab**
- **Content Management**: Browse and filter titles by type, year, genre
- **Factsheet Editor**: Review and edit AI-generated factsheets
- **Data Quality**: Monitor freshness and completeness of title data

#### **Content Studio Tab**
- **Templates**: Manage content generation templates
- **Generators**: Create content packs (Top-10, How-to, Comparisons)
- **Drafts**: Review generated content before publishing
- **Publishing**: Schedule or publish approved content

#### **Jobs & Scheduling Tab**
- **Queue Management**: Monitor running and queued jobs
- **Job History**: Review completed and failed jobs
- **Scheduling**: Configure automated job schedules
- **Control**: Retry failed jobs, cancel running jobs

### **Admin Workflow Actions**

#### **Content Discovery Workflow**
1. **Admin Action**: Click "Run Seed Lists" in TMDB Ingest tab
2. **System Response**: Creates `seed_lists` job in queue
3. **Job Execution**: Fetches trending/top-rated content from TMDB
4. **Result**: Queues `hydrate_title` jobs for detailed data collection

#### **Content Generation Workflow**
1. **Admin Action**: Click "Generate Content Pack" in Content Studio
2. **System Response**: Creates `twice_weekly_content_pack` job
3. **Job Execution**: Generates Top-10 lists and How-to guides
4. **Result**: Creates draft content items for admin review

#### **Content Publishing Workflow**
1. **Admin Action**: Review draft content in Content Studio
2. **Admin Action**: Edit content and approve for publishing
3. **System Response**: Updates content status to `scheduled`
4. **Automated Process**: Publishes content at scheduled time

---

## 6. ✅ **Validation Checklist**

### **Stage 1: TMDB Ingestion**
- [ ] **Seed Lists Job**: Run seed lists job, verify titles queued for hydration
- [ ] **Rate Limiting**: Confirm 250ms delays between TMDB requests
- [ ] **Error Handling**: Test with invalid API key, verify retry behavior
- [ ] **Data Storage**: Check raw_snapshots table for API responses

### **Stage 2: Data Normalization**
- [ ] **Title Creation**: Verify titles table populated with normalized data
- [ ] **Related Data**: Check people, images, videos, keywords tables
- [ ] **Watch Providers**: Confirm streaming data stored correctly
- [ ] **Data Integrity**: Verify foreign key relationships maintained

### **Stage 3: Factsheet Generation**
- [ ] **AI Processing**: Run build_factsheet job, check factsheets table
- [ ] **Content Quality**: Review generated summaries and key points
- [ ] **Data Completeness**: Verify all required fields populated
- [ ] **Update Timestamps**: Check last_verified_at fields updated

### **Stage 4: Content Generation**
- [ ] **Template Rendering**: Generate Top-10 list, verify markdown output
- [ ] **Data Integration**: Check factsheet data properly embedded
- [ ] **SEO Metadata**: Verify JSON-LD structured data generated
- [ ] **Draft Creation**: Confirm content_items created with draft status

### **Stage 5: Content Approval**
- [ ] **Admin Review**: Edit draft content in admin dashboard
- [ ] **Status Update**: Approve content, verify status changed to scheduled
- [ ] **Scheduling**: Set publish date, confirm scheduled_for field updated
- [ ] **Rejection**: Test rejection workflow, verify archived status

### **Stage 6: Content Publishing**
- [ ] **Automated Publishing**: Wait for scheduled time, verify published status
- [ ] **Public Access**: Check content accessible via public API
- [ ] **SEO Implementation**: Verify meta tags and JSON-LD in page source
- [ ] **Performance**: Test page load times and caching

### **End-to-End Validation**
- [ ] **Complete Pipeline**: Run full workflow from TMDB ingestion to published article
- [ ] **Data Consistency**: Verify data integrity across all stages
- [ ] **Admin Dashboard**: Test all admin actions and real-time updates
- [ ] **Public Pages**: Confirm published content displays correctly
- [ ] **Performance**: Monitor job execution times and system resources

---

## 🎯 **Summary**

The YallaCinema content creation workflow is a sophisticated, multi-stage pipeline that transforms raw TMDB data into polished, SEO-optimized articles. The system provides:

1. **Robust Data Ingestion**: Rate-limited, retry-enabled TMDB API integration
2. **Comprehensive Normalization**: Structured storage with proper relationships
3. **AI-Powered Curation**: Automated factsheet generation with human oversight
4. **Template-Based Generation**: Flexible content creation with SEO optimization
5. **Admin-Controlled Publishing**: Review and approval workflow with scheduling
6. **Full Observability**: Job tracking, logging, and real-time monitoring

The workflow ensures data quality, content consistency, and operational efficiency while providing administrators with complete control over the content creation and publishing process.
