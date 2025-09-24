# 🧪 System Testing & Management Guide

## 🎯 **How to Test the Complete System**

### **1. Database Connection Test**
```bash
# Test if Supabase is properly connected
curl -X GET "https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/api/admin/jobs" \
  -H "Content-Type: application/json"
```

### **2. TMDB API Test**
```bash
# Test TMDB integration (requires API key)
curl -X POST "https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/api/admin/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "seed_lists",
    "payload": {
      "countries": ["US"],
      "timeWindow": "week"
    }
  }'
```

### **3. Admin Dashboard Test**
1. Visit: `https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/admin`
2. Check if all sections load properly
3. Test navigation between tabs
4. Verify real-time data updates

### **4. Content Generation Test**
```bash
# Test content generation
curl -X POST "https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/api/admin/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "twice_weekly_content_pack",
    "payload": {
      "countries": ["US", "CA"],
      "generateTop10": true,
      "generateHowTo": true,
      "generateComparison": false
    }
  }'
```

### **5. Job Queue Test**
```bash
# Check job status
curl -X GET "https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/api/admin/jobs?status=queued"

# Check job logs
curl -X GET "https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/api/admin/jobs/[JOB_ID]"
```

## 🎛️ **How to Manage the System Going Forward**

### **Daily Management Tasks**

#### **Morning Routine (5 minutes)**
1. **Check System Health**
   - Visit `/admin` → Overview tab
   - Verify all green indicators
   - Check job queue status

2. **Review Overnight Jobs**
   - Check if seed lists ran successfully
   - Verify content generation completed
   - Review any failed jobs

#### **Content Management (10-15 minutes)**
1. **Review Generated Content**
   - Go to Content Studio → Drafts
   - Review AI-generated articles
   - Edit SEO metadata if needed
   - Schedule or publish content

2. **Monitor Factsheets**
   - Check Titles & Factsheets tab
   - Review any stale factsheets
   - Rebuild if necessary

#### **Weekly Tasks (30 minutes)**
1. **Content Strategy Review**
   - Analyze content performance
   - Adjust generation templates
   - Update trending content lists

2. **System Maintenance**
   - Review job logs for errors
   - Update TMDB configuration if needed
   - Check affiliate link health

### **Admin Dashboard Navigation**

#### **Overview Tab - System Health**
```
📊 Key Metrics to Monitor:
- Titles: Total count and freshness
- Factsheets: Stale vs fresh ratio
- Providers: Last update timestamps
- Content: Drafts, scheduled, published counts
- Jobs: Queue health and failed jobs
- System: Uptime and performance
```

#### **TMDB Ingest Tab - Data Management**
```
🔧 Daily Operations:
1. Configuration: Check TMDB API status
2. Discovery: Run seed lists for new content
3. Changes: Scan for updated titles
4. Hydration: Monitor enrichment queue
```

#### **Titles & Factsheets Tab - Content Curation**
```
📚 Content Management:
1. Filter by type, year, genre, freshness
2. Review and edit factsheets
3. Lock important facts from auto-updates
4. Rebuild stale factsheets
```

#### **Content Studio Tab - Publishing**
```
✍️ Content Operations:
1. Templates: Manage content templates
2. Generators: Create content packs
3. Drafts: Review and edit generated content
4. Publishing: Schedule or publish immediately
```

#### **Jobs & Scheduling Tab - Automation**
```
⚙️ Job Management:
1. Queue: Monitor running jobs
2. History: Review completed jobs
3. Schedules: Adjust automation timing
4. Control: Retry failed jobs
```

### **API Management**

#### **Key API Endpoints**
```typescript
// System Health
GET /api/admin/jobs?status=running
GET /api/admin/jobs?status=failed

// Content Management
GET /api/admin/titles?type=movie&year=2023
GET /api/admin/content?status=draft

// Job Control
POST /api/admin/jobs
PATCH /api/admin/jobs/[id]
POST /api/admin/jobs/[id]/retry
```

#### **Monitoring Commands**
```bash
# Check system health
curl -s "https://your-domain.com/api/admin/jobs" | jq '.jobs | length'

# Monitor job queue
curl -s "https://your-domain.com/api/admin/jobs?status=queued" | jq '.[] | {id, type, status}'

# Check content status
curl -s "https://your-domain.com/api/admin/content?status=draft" | jq '.[] | {title, status, created_at}'
```

### **Database Management**

#### **Key Tables to Monitor**
```sql
-- System Health
SELECT COUNT(*) FROM jobs WHERE status = 'failed';
SELECT COUNT(*) FROM factsheets WHERE last_verified_at < NOW() - INTERVAL '7 days';

-- Content Status
SELECT status, COUNT(*) FROM content_items GROUP BY status;
SELECT COUNT(*) FROM titles WHERE updated_at < NOW() - INTERVAL '1 day';

-- Performance
SELECT type, AVG(EXTRACT(EPOCH FROM (finished_at - started_at))) as avg_duration
FROM jobs WHERE status = 'done' GROUP BY type;
```

#### **Database Maintenance**
```sql
-- Clean up old job logs (monthly)
DELETE FROM job_logs WHERE ts < NOW() - INTERVAL '30 days';

-- Update stale factsheets
UPDATE factsheets SET last_verified_at = NOW() 
WHERE last_verified_at < NOW() - INTERVAL '7 days';

-- Refresh provider data
UPDATE watch_providers SET fetched_at = NOW() 
WHERE fetched_at < NOW() - INTERVAL '1 day';
```

### **Troubleshooting Guide**

#### **Common Issues & Solutions**

**1. Jobs Failing**
```bash
# Check job logs
curl -X GET "https://your-domain.com/api/admin/jobs/[JOB_ID]"

# Retry failed job
curl -X POST "https://your-domain.com/api/admin/jobs/[JOB_ID]/retry"
```

**2. TMDB API Issues**
```bash
# Check API key status
curl -X GET "https://api.themoviedb.org/3/configuration?api_key=YOUR_KEY"

# Test rate limiting
curl -X GET "https://api.themoviedb.org/3/trending/movie/week?api_key=YOUR_KEY"
```

**3. Database Connection Issues**
```bash
# Test Supabase connection
curl -X GET "https://your-domain.com/api/admin/jobs" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Content Generation Issues**
```bash
# Check content templates
curl -X GET "https://your-domain.com/api/admin/content?kind=top"

# Test content generation
curl -X POST "https://your-domain.com/api/admin/jobs" \
  -d '{"type": "build_factsheet", "payload": {"titleId": "TITLE_ID"}}'
```

### **Performance Monitoring**

#### **Key Metrics to Track**
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

#### **Monitoring Dashboard**
```bash
# Create monitoring script
#!/bin/bash
echo "=== System Health Check ==="
echo "Jobs in queue: $(curl -s 'https://your-domain.com/api/admin/jobs?status=queued' | jq 'length')"
echo "Failed jobs: $(curl -s 'https://your-domain.com/api/admin/jobs?status=failed' | jq 'length')"
echo "Draft content: $(curl -s 'https://your-domain.com/api/admin/content?status=draft' | jq 'length')"
echo "System uptime: $(uptime)"
```

### **Backup & Recovery**

#### **Database Backup**
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250101.sql
```

#### **Content Backup**
```bash
# Export content items
curl -s "https://your-domain.com/api/admin/content" > content_backup.json

# Export settings
curl -s "https://your-domain.com/api/admin/settings" > settings_backup.json
```

### **Scaling & Optimization**

#### **Performance Optimization**
```typescript
// Database Indexing
CREATE INDEX CONCURRENTLY idx_titles_popularity ON titles(popularity DESC);
CREATE INDEX CONCURRENTLY idx_jobs_status ON jobs(status);
CREATE INDEX CONCURRENTLY idx_content_status ON content_items(status);

// Caching Strategy
- API responses: 5 minutes
- Factsheets: 15 minutes
- Provider data: 1 hour
- Static content: 24 hours
```

#### **Scaling Considerations**
```typescript
// Horizontal Scaling
- Use Redis for job queues
- Implement database read replicas
- Add CDN for static assets
- Use edge functions for API routes

// Vertical Scaling
- Increase database connections
- Add more memory for caching
- Optimize database queries
- Implement connection pooling
```

### **Security Management**

#### **Access Control**
```typescript
// Admin User Management
- Regular password updates
- Role-based permissions
- Audit log monitoring
- API key rotation

// Data Protection
- RLS policies enforcement
- Input validation
- Rate limiting
- Error message sanitization
```

#### **Security Monitoring**
```bash
# Check audit logs
SELECT * FROM audit_logs WHERE ts > NOW() - INTERVAL '24 hours' ORDER BY ts DESC;

# Monitor failed logins
SELECT * FROM audit_logs WHERE action = 'login_failed' AND ts > NOW() - INTERVAL '1 hour';
```

### **Cost Management**

#### **Resource Optimization**
```typescript
// Database Costs
- Monitor query performance
- Optimize indexes
- Clean up old data
- Use connection pooling

// API Costs
- Monitor TMDB API usage
- Implement caching
- Batch requests
- Use rate limiting
```

#### **Cost Monitoring**
```bash
# Track API usage
curl -s "https://api.themoviedb.org/3/account" | jq '.usage'

# Monitor database size
SELECT pg_size_pretty(pg_database_size('your_database'));
```

## 🎯 **Quick Start Checklist**

### **Daily (5 minutes)**
- [ ] Check admin dashboard overview
- [ ] Review job queue status
- [ ] Check for failed jobs
- [ ] Review generated content

### **Weekly (30 minutes)**
- [ ] Review content performance
- [ ] Update trending content
- [ ] Check system logs
- [ ] Optimize database queries

### **Monthly (2 hours)**
- [ ] Review system metrics
- [ ] Update content templates
- [ ] Clean up old data
- [ ] Security audit
- [ ] Backup verification

### **Quarterly (1 day)**
- [ ] System architecture review
- [ ] Performance optimization
- [ ] Security updates
- [ ] Feature planning
- [ ] Cost analysis

## 🚀 **Getting Started Right Now**

1. **Visit the Admin Dashboard**: `https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/admin`
2. **Check System Health**: Look at the Overview tab
3. **Run Your First Job**: Go to TMDB Ingest → Run Seed Lists
4. **Generate Content**: Go to Content Studio → Generate Content Pack
5. **Monitor Progress**: Check Jobs & Scheduling tab

The system is **fully operational** and ready for production use! 🎬✨
