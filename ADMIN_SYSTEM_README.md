# 🎬 YallaCinema Admin Dashboard System

A production-ready admin dashboard system for managing movie and TV show content, built with Next.js 14, TypeScript, and Supabase.

## 🚀 **System Overview**

This system provides a complete content management pipeline:
- **Ingest** → **Normalize** → **Curate** → **Generate** → **Approve** → **Publish**

All operations are observable and controllable through the admin dashboard.

## 📋 **Features Implemented**

### ✅ **Core Infrastructure**
- **Database Schema**: Complete Supabase schema with 20+ tables
- **TMDB Integration**: Enhanced client with retry/backoff and rate limiting
- **Job System**: Background job processing with queue management
- **API Endpoints**: RESTful APIs for all admin operations
- **Content Generation**: AI-powered content creation pipeline

### ✅ **Admin Dashboard**
- **Overview**: Real-time system health and metrics
- **TMDB Ingest**: Manage data ingestion and synchronization
- **Titles & Factsheets**: Content management and curation
- **Watch Providers**: Streaming platform integration
- **Content Studio**: Generate and publish content
- **Jobs & Scheduling**: Monitor and control background jobs
- **Settings & Access**: System configuration and user management

### ✅ **Content Pipeline**
- **Seed Lists**: Daily trending/top-rated content discovery
- **Changes Scan**: Nightly updates for modified content
- **Hydration**: Detailed content enrichment
- **Factsheet Building**: AI-curated content summaries
- **Content Generation**: Automated article creation
- **Publishing**: Scheduled content deployment

## 🗄️ **Database Schema**

### **Core Tables**
```sql
-- Content & TMDB
titles (tmdb_id, type, slug, title, overview, runtime, etc.)
external_ids (imdb_id, tvdb_id, socials)
people, credits_people
images, videos, keywords
watch_providers (country, flatrate/rent/buy arrays)
raw_snapshots (endpoint, payload JSONB, hash)
factsheets (AI-curated JSONB + locked fields)

-- Content System
content_items (kind, title_id, slug, status, body_md, seo_jsonld)
content_templates (kind, template_md, template_blocks)
content_runs (trigger, metrics, initiated_by)

-- News & SEO
news_feeds (name, source_type, url, country, active)
news_articles (source, url, title, entities, status)

-- Affiliates
affiliates (title_id, country, provider, url, expires_at)
affiliate_providers (name, resolver_strategy, active)

-- Admin & Jobs
admin_users (email, role, active)
jobs (type, payload, status, attempts, error, scheduled_for)
job_logs (job_id, level, message, data)
settings (key, value JSONB)
audit_logs (actor_email, action, entity, diff)
```

## 🔧 **Environment Setup**

### **Required Environment Variables**
```bash
# TMDB Configuration
TMDB_API_KEY="your_tmdb_api_key"
NEXT_PUBLIC_SITE_REGION_DEFAULT="US"
REGION_FALLBACK="CA"

# Database
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

# Site Configuration
SITE_BRAND_NAME="YallaCinema"
NEXT_PUBLIC_SITE_URL="https://yallacinema.com"

# Admin Auth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="https://yallacinema.com"

# Content Generation
OPENAI_API_KEY="your_openai_key"
CONTENT_GENERATION_ENABLED="true"

# Optional: Redis for BullMQ
REDIS_URL="your_redis_url"
```

## 🚀 **Getting Started**

### **1. Database Setup**
```bash
# Run the migration
supabase db push

# Or manually run the SQL
psql -f supabase/migrations/20250101000000_all_in_dashboard.sql
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
```bash
cp env.example .env.local
# Edit .env.local with your actual values
```

### **4. Build and Deploy**
```bash
npm run build
npm run start
```

## 📊 **Admin Dashboard Usage**

### **Overview Tab**
- **System Health**: Monitor job queue, content freshness, provider status
- **Quick Actions**: Run seed lists, generate content, check job queue
- **Metrics**: Content output, traffic-to-conversion placeholders

### **TMDB Ingest Tab**
- **Configuration**: View cached TMDB config, image URLs, allowed sizes
- **Discovery**: Run seed lists for trending/top-rated content
- **Changes**: Scan for updated titles and queue hydration
- **Hydration Queue**: Monitor and manage title enrichment jobs

### **Titles & Factsheets Tab**
- **Content Management**: Filter by type, year, genre, freshness
- **Factsheet Editor**: View and edit curated content with lock toggles
- **Bulk Operations**: Mark for review, lock facts, rebuild factsheets

### **Watch Providers Tab**
- **Provider Management**: View US/CA provider arrays with timestamps
- **Refresh Operations**: Update provider data for specific titles
- **Affiliate Integration**: Manage affiliate links and TTL settings

### **Content Studio Tab**
- **Templates**: CRUD for content templates (Top-10, Comparison, How-to)
- **Generators**: Create content packs, comparisons, how-to guides
- **Drafts**: Manage content items with SEO fields and scheduling
- **Publishing**: Schedule or publish content immediately

### **Jobs & Scheduling Tab**
- **Queue Management**: View live job status, attempts, timings
- **Job Control**: Retry, cancel, requeue batch operations
- **Schedule Configuration**: Edit cron-like schedules for automated tasks

## 🔄 **Job System**

### **Available Jobs**
```typescript
// Data Ingestion
'seed_lists'           // Daily trending/top-rated discovery
'changes_scan'         // Nightly updates for modified content
'hydrate_title'        // Detailed content enrichment
'refresh_providers'    // Daily provider data updates

// Content Generation
'build_factsheet'      // AI-curated content summaries
'twice_weekly_content_pack' // Automated article creation

// Maintenance
'refresh_affiliates'   // Affiliate link management
'link_health_check'    // Nightly link validation
'ingest_news_feeds'    // RSS feed processing
'news_entity_linking'  // Link news to titles
```

### **Default Schedules**
```bash
Seed Lists:        Daily 06:15 ET
Changes Scan:      Nightly 01:30 ET
Providers Refresh: Daily 07:00 ET
Content Pack:      Tue & Fri 09:00 ET
Link Health:       Nightly 03:00 ET
```

## 📡 **API Endpoints**

### **Public APIs**
```typescript
GET /api/factsheets/[type]/[tmdbId]?country=US|CA
GET /api/search?q=query&filters=...
```

### **Admin APIs**
```typescript
// Jobs
GET    /api/admin/jobs
POST   /api/admin/jobs
GET    /api/admin/jobs/[id]
PATCH  /api/admin/jobs/[id]
POST   /api/admin/jobs/[id]/retry
DELETE /api/admin/jobs/[id]

// Titles
GET /api/admin/titles?type=movie&year=2023&genre=18

// Content
GET    /api/admin/content
POST   /api/admin/content
PATCH  /api/admin/content/[id]
DELETE /api/admin/content/[id]

// Settings
GET  /api/admin/settings
POST /api/admin/settings
```

### **Cron Endpoints**
```typescript
POST /api/cron/process-jobs  // Process job queue
```

## 🎯 **Content Generation**

### **Template System**
- **Top 10 Lists**: Movies/TV shows by genre and country
- **How-to Guides**: Streaming instructions for specific titles
- **Comparisons**: Head-to-head title comparisons
- **News Digests**: Weekly roundups by genre/country

### **Generation Pipeline**
1. **Data Collection**: Fetch titles from factsheets
2. **Template Rendering**: Apply Handlebars-like templating
3. **SEO Optimization**: Generate meta tags and JSON-LD
4. **Draft Creation**: Save as draft for review
5. **Publishing**: Schedule or publish immediately

### **Content Types**
```typescript
type ContentKind = 'article' | 'top' | 'comparison' | 'howto' | 'news_digest'
type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'
```

## 🔒 **Security & Compliance**

### **Access Control**
- **Admin Routes**: Protected with authentication
- **Public APIs**: Rate limited and cached
- **Database**: RLS policies for data access

### **TMDB Attribution**
- **Footer**: Auto-rendered TMDB attribution
- **API Compliance**: Proper user-agent and rate limiting
- **Data Usage**: Respects TMDB terms of service

### **Affiliate Compliance**
- **Disclosure**: Required affiliate disclosure text
- **Link Attributes**: `rel="sponsored nofollow"` for affiliate CTAs
- **Audit Trail**: Complete audit logs for all admin actions

## 📈 **Monitoring & Observability**

### **Job Monitoring**
- **Queue Health**: Real-time job status and metrics
- **Error Tracking**: Detailed error logs with stack traces
- **Performance**: Job duration and success rates

### **Content Metrics**
- **Freshness**: Factsheet staleness tracking
- **Provider Health**: Streaming platform data freshness
- **Content Output**: Articles generated per week

### **System Health**
- **Database**: Connection status and query performance
- **External APIs**: TMDB API health and rate limits
- **Cache Performance**: Hit ratios and response times

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Deploy to production
vercel --prod

# Set environment variables
vercel env add TMDB_API_KEY
vercel env add SUPABASE_URL
# ... add all required variables
```

### **Database Migration**
```bash
# Run migrations
supabase db push

# Or use the SQL file directly
psql -f supabase/migrations/20250101000000_all_in_dashboard.sql
```

### **Cron Jobs Setup**
```bash
# Set up Vercel Cron for job processing
# Add to vercel.json:
{
  "crons": [
    {
      "path": "/api/cron/process-jobs",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test
```

### **Integration Tests**
```bash
npm run test:integration
```

### **API Testing**
```bash
# Test admin endpoints
curl -X GET "http://localhost:3000/api/admin/jobs"
curl -X POST "http://localhost:3000/api/admin/jobs" \
  -H "Content-Type: application/json" \
  -d '{"type": "seed_lists", "payload": {"countries": ["US", "CA"]}}'
```

## 📚 **Development**

### **Project Structure**
```
├── app/
│   ├── admin/                 # Admin dashboard pages
│   ├── api/                   # API routes
│   └── (public pages)         # Public-facing pages
├── components/
│   ├── admin/                 # Admin dashboard components
│   └── (public components)    # Public-facing components
├── lib/
│   ├── database.ts            # Database client and types
│   ├── jobs.ts                # Job system
│   ├── tmdb-enhanced.ts       # TMDB API client
│   ├── content-generation.ts  # Content creation
│   └── (other utilities)      # Shared utilities
├── supabase/
│   └── migrations/            # Database migrations
└── (config files)             # Next.js, TypeScript, etc.
```

### **Key Files**
- `lib/database.ts` - Database client with type safety
- `lib/jobs.ts` - Background job processing system
- `lib/tmdb-enhanced.ts` - TMDB API with retry/backoff
- `lib/content-generation.ts` - AI content creation
- `components/admin/` - Admin dashboard components
- `app/api/admin/` - Admin API endpoints

## 🎯 **Next Steps**

### **Phase 1: Content Expansion**
- [ ] Individual movie/TV show pages
- [ ] Search functionality
- [ ] User reviews and ratings
- [ ] More blog content

### **Phase 2: Advanced Features**
- [ ] News ingestion and approval workflow
- [ ] Affiliate management system
- [ ] A/B testing for content
- [ ] Advanced analytics

### **Phase 3: Growth**
- [ ] International SEO
- [ ] Advanced personalization
- [ ] Machine learning for content
- [ ] Social media integration

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the admin dashboard help sections

---

**Built with ❤️ for content creators and movie enthusiasts**
