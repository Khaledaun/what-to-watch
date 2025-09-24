# 🎬 Complete System Management Guide

## 🚨 **Current Status: System Built, Database Setup Required**

The admin dashboard system is **fully built and deployed**, but needs database configuration to be fully operational.

**Live System**: https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app
**Admin Dashboard**: https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/admin

## 🔧 **Step 1: Database Setup (Required)**

### **Option A: Supabase (Recommended)**

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Note down your project URL and API keys
   ```

2. **Run Database Migration**
   ```bash
   # Copy the migration file to Supabase
   # Go to SQL Editor in Supabase dashboard
   # Paste contents of: supabase/migrations/20250101000000_all_in_dashboard.sql
   # Execute the migration
   ```

3. **Set Environment Variables in Vercel**
   ```bash
   # Go to Vercel dashboard → Project → Settings → Environment Variables
   # Add these variables:
   
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   TMDB_API_KEY=your-tmdb-api-key
   SITE_BRAND_NAME=YallaCinema
   NEXT_PUBLIC_SITE_URL=https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### **Option B: Local Development**

1. **Set up local environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your values
   ```

2. **Run locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000/admin
   ```

## 🎯 **Step 2: System Management (After Database Setup)**

### **Daily Operations (5 minutes)**

#### **Morning Health Check**
1. **Visit Admin Dashboard**: `/admin`
2. **Check Overview Tab**:
   - ✅ All metrics should be green
   - ✅ Job queue should be healthy
   - ✅ No failed jobs

3. **Review Overnight Jobs**:
   - Go to "Jobs & Scheduling" tab
   - Check if seed lists ran successfully
   - Review any failed jobs

#### **Content Management**
1. **Review Generated Content**:
   - Go to "Content Studio" → "Drafts"
   - Review AI-generated articles
   - Edit SEO metadata if needed
   - Schedule or publish content

2. **Monitor Factsheets**:
   - Go to "Titles & Factsheets" tab
   - Check for stale factsheets
   - Rebuild if necessary

### **Weekly Operations (30 minutes)**

#### **Content Strategy**
1. **Generate Weekly Content Pack**:
   - Go to "Content Studio" → "Generators"
   - Click "Generate Twice-Weekly Pack"
   - Review and publish generated content

2. **Update Trending Content**:
   - Go to "TMDB Ingest" → "Discovery"
   - Run "Seed Lists" for fresh content
   - Monitor hydration queue

#### **System Maintenance**
1. **Review Job Logs**:
   - Check "Jobs & Scheduling" tab
   - Look for any recurring failures
   - Retry failed jobs if needed

2. **Update Configuration**:
   - Go to "Settings & Access"
   - Review system settings
   - Update any outdated configurations

### **Monthly Operations (2 hours)**

#### **Performance Review**
1. **Analyze System Metrics**:
   - Review job completion rates
   - Check content generation performance
   - Monitor API response times

2. **Content Optimization**:
   - Update content templates
   - Adjust generation parameters
   - Review SEO performance

#### **Data Maintenance**
1. **Clean Up Old Data**:
   ```sql
   -- Run in Supabase SQL Editor
   DELETE FROM job_logs WHERE ts < NOW() - INTERVAL '30 days';
   DELETE FROM raw_snapshots WHERE fetched_at < NOW() - INTERVAL '7 days';
   ```

2. **Update Provider Data**:
   - Go to "Watch Providers" tab
   - Refresh provider data for popular titles
   - Check affiliate link health

## 🎛️ **Admin Dashboard Usage Guide**

### **Overview Tab - System Health**
```
📊 Key Metrics:
- Titles: Total count and freshness status
- Factsheets: Stale vs fresh ratio
- Providers: Last update timestamps
- Content: Drafts, scheduled, published counts
- Jobs: Queue health and failed jobs
- System: Uptime and performance indicators

🎯 Quick Actions:
- Run Seed Lists: Update trending content
- Generate Content Pack: Create weekly content
- Check Job Queue: Monitor system health
```

### **TMDB Ingest Tab - Data Management**
```
🔧 Configuration:
- View TMDB API configuration
- Check image base URLs and allowed sizes
- Refresh configuration if needed

📈 Discovery:
- Run seed lists for trending content
- Monitor last run results
- Configure countries (US, CA)

🔄 Changes:
- Scan for updated titles
- Queue titles for hydration
- Monitor change detection

⚡ Hydration Queue:
- View titles waiting for enrichment
- Monitor job status and attempts
- Retry failed hydrations
```

### **Titles & Factsheets Tab - Content Curation**
```
📚 Content Management:
- Filter by type (movie/TV), year, genre, freshness
- View and edit factsheets
- Lock important facts from auto-updates
- Rebuild stale factsheets

🔒 Factsheet Editor:
- View curated data and source information
- Edit locked fields
- Save updates to factsheets
- Monitor verification timestamps
```

### **Watch Providers Tab - Streaming Integration**
```
📺 Provider Management:
- View US/CA provider arrays with timestamps
- Refresh provider data for specific titles
- Monitor provider freshness

🔗 Affiliate Management:
- View affiliate links per title
- Set manual URLs
- Check link health
- Configure TTL settings
```

### **Content Studio Tab - Publishing**
```
📝 Templates:
- Manage content templates (Top-10, Comparison, How-to)
- Edit template variables and structure
- Activate/deactivate templates

🎨 Generators:
- Generate content packs (Top-10 US/CA, How-to guides)
- Create comparisons between titles
- Generate how-to-watch articles

📄 Drafts:
- Review generated content
- Edit SEO metadata and JSON-LD
- Schedule or publish content
- Manage content status (draft → scheduled → published)
```

### **Jobs & Scheduling Tab - Automation**
```
⚙️ Job Management:
- View live job queue status
- Monitor job attempts and timings
- Retry failed jobs
- Cancel running jobs

📅 Schedules:
- Configure automated job schedules
- Set cron-like timing for:
  - Seed Lists: Daily 06:15 ET
  - Changes Scan: Nightly 01:30 ET
  - Providers Refresh: Daily 07:00 ET
  - Content Pack: Tue & Fri 09:00 ET
  - Link Health: Nightly 03:00 ET
```

### **Settings & Access Tab - Configuration**
```
👥 User Management:
- Manage admin users and roles
- Set permissions (owner, editor, analyst)
- Monitor user activity

⚙️ System Settings:
- Brand name and attribution
- Default countries and languages
- SEO defaults and robots settings
- Affiliate disclosure text
- TMDB attribution settings
```

## 🔄 **Job System Management**

### **Available Jobs**
```typescript
// Data Ingestion Jobs
'seed_lists'           // Daily trending/top-rated discovery
'changes_scan'         // Nightly updates for modified content
'hydrate_title'        // Detailed content enrichment
'refresh_providers'    // Daily provider data updates

// Content Generation Jobs
'build_factsheet'      // AI-curated content summaries
'twice_weekly_content_pack' // Automated article creation

// Maintenance Jobs
'refresh_affiliates'   // Affiliate link management
'link_health_check'    // Nightly link validation
'ingest_news_feeds'    // RSS feed processing
'news_entity_linking'  // Link news to titles
```

### **Job Management Commands**
```bash
# Create a job
curl -X POST "https://your-domain.com/api/admin/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "seed_lists",
    "payload": {
      "countries": ["US", "CA"],
      "timeWindow": "week"
    }
  }'

# Check job status
curl -X GET "https://your-domain.com/api/admin/jobs?status=queued"

# Retry failed job
curl -X POST "https://your-domain.com/api/admin/jobs/[JOB_ID]/retry"

# Cancel job
curl -X DELETE "https://your-domain.com/api/admin/jobs/[JOB_ID]"
```

## 📊 **Monitoring & Analytics**

### **Key Metrics to Track**
```typescript
// System Performance
- Job completion rate: >95%
- Average job duration: <30 seconds
- API response time: <2 seconds
- Database query time: <1 second

// Content Quality
- Factsheet freshness: >90% updated in last 7 days
- Content generation: 2-3 articles per week
- Provider data: Updated daily
- Search response: <500ms
```

### **Health Check Commands**
```bash
# Check system health
curl -s "https://your-domain.com/api/admin/jobs" | jq '.jobs | length'

# Monitor job queue
curl -s "https://your-domain.com/api/admin/jobs?status=queued" | jq '.[] | {id, type, status}'

# Check content status
curl -s "https://your-domain.com/api/admin/content?status=draft" | jq '.[] | {title, status, created_at}'
```

## 🚨 **Troubleshooting Guide**

### **Common Issues & Solutions**

#### **1. Database Connection Issues**
```bash
# Check Supabase connection
curl -X GET "https://your-domain.com/api/admin/jobs"

# Verify environment variables in Vercel
# Go to Vercel Dashboard → Project → Settings → Environment Variables
```

#### **2. TMDB API Issues**
```bash
# Test TMDB API key
curl -X GET "https://api.themoviedb.org/3/configuration?api_key=YOUR_KEY"

# Check rate limiting
curl -X GET "https://api.themoviedb.org/3/trending/movie/week?api_key=YOUR_KEY"
```

#### **3. Job Failures**
```bash
# Check job logs
curl -X GET "https://your-domain.com/api/admin/jobs/[JOB_ID]"

# Retry failed job
curl -X POST "https://your-domain.com/api/admin/jobs/[JOB_ID]/retry"
```

#### **4. Content Generation Issues**
```bash
# Check content templates
curl -X GET "https://your-domain.com/api/admin/content?kind=top"

# Test content generation
curl -X POST "https://your-domain.com/api/admin/jobs" \
  -d '{"type": "build_factsheet", "payload": {"titleId": "TITLE_ID"}}'
```

## 🎯 **Quick Start Checklist**

### **Immediate Setup (30 minutes)**
- [ ] Set up Supabase project
- [ ] Run database migration
- [ ] Configure environment variables in Vercel
- [ ] Redeploy application
- [ ] Test admin dashboard access

### **First Day Operations (1 hour)**
- [ ] Visit admin dashboard
- [ ] Check system health overview
- [ ] Run first seed lists job
- [ ] Generate first content pack
- [ ] Review generated content
- [ ] Publish first articles

### **First Week Operations (2 hours)**
- [ ] Set up automated schedules
- [ ] Monitor job performance
- [ ] Review content quality
- [ ] Optimize templates
- [ ] Check provider data freshness

### **Ongoing Management (5-30 minutes daily)**
- [ ] Daily health check
- [ ] Review generated content
- [ ] Monitor job queue
- [ ] Check for failed jobs
- [ ] Update trending content

## 🚀 **Getting Started Right Now**

1. **Set up Database** (Required):
   - Create Supabase project
   - Run the migration SQL
   - Configure environment variables

2. **Access Admin Dashboard**:
   - Visit: https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/admin
   - Check Overview tab for system health

3. **Run Your First Job**:
   - Go to TMDB Ingest → Discovery
   - Click "Run Seed Lists"
   - Monitor progress in Jobs tab

4. **Generate Content**:
   - Go to Content Studio → Generators
   - Click "Generate Content Pack"
   - Review and publish generated content

5. **Monitor System**:
   - Check Jobs & Scheduling tab
   - Review system metrics
   - Set up automated schedules

## 📞 **Support & Resources**

- **Documentation**: `ADMIN_SYSTEM_README.md`
- **Testing Guide**: `SYSTEM_TESTING_AND_MANAGEMENT_GUIDE.md`
- **Database Schema**: `supabase/migrations/20250101000000_all_in_dashboard.sql`
- **Environment Setup**: `env.example`

The system is **fully built and ready for production use** once the database is configured! 🎬✨
