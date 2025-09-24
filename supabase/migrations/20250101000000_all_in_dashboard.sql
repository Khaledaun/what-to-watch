-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA extensions;

-- Create enums
DO $$ BEGIN
    CREATE TYPE title_type AS ENUM ('movie', 'tv');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_kind AS ENUM ('article', 'top', 'comparison', 'howto', 'news_digest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('queued', 'running', 'done', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM ('owner', 'editor', 'analyst');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE news_status AS ENUM ('queued', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_type AS ENUM ('rss', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Core content & TMDB tables
CREATE TABLE IF NOT EXISTS titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    type title_type NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    tagline TEXT,
    runtime INTEGER, -- minutes for movies, avg episode length for TV
    episode_count INTEGER, -- for TV shows
    season_count INTEGER, -- for TV shows
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
    production_countries TEXT[], -- ISO country codes
    spoken_languages TEXT[], -- ISO language codes
    poster_path TEXT, -- TMDB poster path
    backdrop_path TEXT, -- TMDB backdrop path
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS external_ids (
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    imdb_id TEXT,
    tvdb_id INTEGER,
    facebook_id TEXT,
    instagram_id TEXT,
    twitter_id TEXT,
    PRIMARY KEY (title_id)
);

CREATE TABLE IF NOT EXISTS people (
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

CREATE TABLE IF NOT EXISTS credits_people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE CASCADE,
    character TEXT,
    job TEXT, -- for crew
    department TEXT, -- for crew
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    aspect_ratio DECIMAL(5,2),
    height INTEGER,
    width INTEGER,
    vote_average DECIMAL(3,1),
    vote_count INTEGER,
    image_type TEXT NOT NULL, -- poster, backdrop, logo, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    key TEXT NOT NULL, -- YouTube key, etc.
    name TEXT,
    site TEXT NOT NULL, -- YouTube, Vimeo, etc.
    size INTEGER,
    type TEXT NOT NULL, -- Trailer, Teaser, Clip, etc.
    official BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS title_keywords (
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, keyword_id)
);

CREATE TABLE IF NOT EXISTS watch_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    country TEXT NOT NULL, -- ISO country code
    flatrate JSONB, -- array of provider objects
    rent JSONB, -- array of provider objects
    buy JSONB, -- array of provider objects
    link TEXT,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (title_id, country)
);

CREATE TABLE IF NOT EXISTS raw_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    payload JSONB NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    hash TEXT NOT NULL -- for deduplication
);

CREATE TABLE IF NOT EXISTS factsheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    curated_data JSONB NOT NULL, -- AI/page-ready curated data
    locked_fields JSONB DEFAULT '{}', -- fields that are locked from auto-updates
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (title_id)
);

-- Content system
CREATE TABLE IF NOT EXISTS content_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kind content_kind NOT NULL,
    name TEXT NOT NULL,
    template_md TEXT,
    template_blocks JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (kind, name)
);

CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kind content_kind NOT NULL,
    title_id UUID REFERENCES titles(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    language TEXT NOT NULL DEFAULT 'en-US',
    status content_status NOT NULL DEFAULT 'draft',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    seo_jsonld JSONB,
    body_md TEXT,
    category TEXT,
    read_time INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (slug, country, language)
);

CREATE TABLE IF NOT EXISTS content_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trigger TEXT NOT NULL, -- cron, manual
    run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL,
    metrics JSONB,
    initiated_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News for SEO
CREATE TABLE IF NOT EXISTS news_feeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    source_type source_type NOT NULL,
    url TEXT,
    country TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    country TEXT NOT NULL,
    entities JSONB, -- linked titles/people
    keywords TEXT[],
    status news_status NOT NULL DEFAULT 'queued',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    UNIQUE (url)
);

-- Affiliate prep
CREATE TABLE IF NOT EXISTS affiliate_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    resolver_strategy TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
    country TEXT NOT NULL,
    provider TEXT NOT NULL,
    url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (title_id, country, provider)
);

-- Admin, jobs, settings
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role admin_role NOT NULL DEFAULT 'analyst',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    payload JSONB,
    status job_status NOT NULL DEFAULT 'queued',
    attempts INTEGER DEFAULT 0,
    error TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level TEXT NOT NULL, -- info, warn, error
    message TEXT NOT NULL,
    data JSONB
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    diff JSONB,
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_titles_type_year ON titles(type, EXTRACT(YEAR FROM COALESCE(release_date, first_air_date)));
CREATE INDEX IF NOT EXISTS idx_titles_slug ON titles(slug);
CREATE INDEX IF NOT EXISTS idx_titles_tmdb_id ON titles(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_titles_popularity ON titles(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_titles_vote_average ON titles(vote_average DESC);

-- idx_watch_providers_title_country is redundant with UNIQUE constraint
CREATE INDEX IF NOT EXISTS idx_watch_providers_country ON watch_providers(country);

CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_entities ON news_articles USING GIN(entities);
CREATE INDEX IF NOT EXISTS idx_news_articles_keywords ON news_articles USING GIN(keywords);

CREATE INDEX IF NOT EXISTS idx_affiliates_country_provider ON affiliates(country, provider);
CREATE INDEX IF NOT EXISTS idx_affiliates_title_country ON affiliates(title_id, country);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_for ON jobs(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);

CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled_for ON content_items(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_content_items_published_at ON content_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ts ON audit_logs(ts DESC);

-- RLS Policies
ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE factsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Public read access for titles (limited fields)
DROP POLICY IF EXISTS "Public can read titles" ON titles;
CREATE POLICY "Public can read titles" ON titles
    FOR SELECT USING (true);

-- Public read access for factsheets
DROP POLICY IF EXISTS "Public can read factsheets" ON factsheets;
CREATE POLICY "Public can read factsheets" ON factsheets
    FOR SELECT USING (true);

-- Public read access for published content
DROP POLICY IF EXISTS "Public can read published content" ON content_items;
CREATE POLICY "Public can read published content" ON content_items
    FOR SELECT USING (status = 'published');

-- Public read access for approved news
DROP POLICY IF EXISTS "Public can read approved news" ON news_articles;
CREATE POLICY "Public can read approved news" ON news_articles
    FOR SELECT USING (status = 'approved');

-- Admin-only policies for all other tables
DROP POLICY IF EXISTS "Admin only access" ON admin_users;
CREATE POLICY "Admin only access" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin only access" ON jobs;
CREATE POLICY "Admin only access" ON jobs
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin only access" ON job_logs;
CREATE POLICY "Admin only access" ON job_logs
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin only access" ON settings;
CREATE POLICY "Admin only access" ON settings
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin only access" ON audit_logs;
CREATE POLICY "Admin only access" ON audit_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('tmdb_config_cache', '{}'),
('default_languages', '["en-US", "fr-CA"]'),
('default_countries', '["US", "CA"]'),
('content_schedule', '{"days": ["tuesday", "friday"], "time": "09:00", "timezone": "America/New_York"}'),
('site_brand_name', '"YallaCinema"'),
('seo_defaults', '{"meta_suffix": " | YallaCinema", "robots": "index, follow"}'),
('affiliate_disclosure', '"Some links may earn us a commission at no cost to you."')
ON CONFLICT (key) DO NOTHING;

-- Insert default content templates
INSERT INTO content_templates (kind, name, template_md, template_blocks) 
SELECT * FROM (VALUES
('top'::content_kind, 'Top 10 Movies', '# Top 10 {{genre}} Movies to Watch {{country}}\n\n{{#each movies}}\n## {{@index}}. {{title}} ({{year}})\n{{overview}}\n\n**Where to watch:** {{providers}}\n\n{{/each}}', '{}'::jsonb),
('top'::content_kind, 'Top 10 TV Shows', '# Top 10 {{genre}} TV Shows to Watch {{country}}\n\n{{#each shows}}\n## {{@index}}. {{title}} ({{year}})\n{{overview}}\n\n**Where to watch:** {{providers}}\n\n{{/each}}', '{}'::jsonb),
('howto'::content_kind, 'How to Watch', '# How to Watch {{title}} ({{year}})\n\n{{overview}}\n\n## Where to Stream {{title}}\n\n{{#each providers}}\n- **{{name}}**: {{url}}\n{{/each}}\n\n## Cast & Crew\n\n{{#each cast}}\n- **{{name}}** as {{character}}\n{{/each}}', '{}'::jsonb),
('comparison'::content_kind, 'Movie Comparison', '# {{title1}} vs {{title2}}: Which Should You Watch?\n\n## {{title1}} ({{year1}})\n{{overview1}}\n\n## {{title2}} ({{year2}})\n{{overview2}}\n\n## Verdict\n\n{{comparison}}', '{}'::jsonb)
) AS v(kind, name, template_md, template_blocks)
WHERE NOT EXISTS (
    SELECT 1 FROM content_templates ct 
    WHERE ct.kind = v.kind AND ct.name = v.name
);

-- Insert default affiliate providers
INSERT INTO affiliate_providers (name, active, resolver_strategy, notes) VALUES
('Netflix', true, 'direct', 'Direct streaming service'),
('Amazon Prime Video', true, 'amazon_associate', 'Amazon Associates program'),
('Disney+', true, 'direct', 'Direct streaming service'),
('Hulu', true, 'direct', 'Direct streaming service'),
('Max', true, 'direct', 'Direct streaming service'),
('Apple TV+', true, 'direct', 'Direct streaming service'),
('Paramount+', true, 'direct', 'Direct streaming service'),
('Peacock', true, 'direct', 'Direct streaming service')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_titles_updated_at ON titles;
CREATE TRIGGER update_titles_updated_at BEFORE UPDATE ON titles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_people_updated_at ON people;
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_factsheets_updated_at ON factsheets;
CREATE TRIGGER update_factsheets_updated_at BEFORE UPDATE ON factsheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_templates_updated_at ON content_templates;
CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_feeds_updated_at ON news_feeds;
CREATE TRIGGER update_news_feeds_updated_at BEFORE UPDATE ON news_feeds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliate_providers_updated_at ON affiliate_providers;
CREATE TRIGGER update_affiliate_providers_updated_at BEFORE UPDATE ON affiliate_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for content_items columns
COMMENT ON COLUMN content_items.read_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN content_items.word_count IS 'Total word count of the article';
COMMENT ON COLUMN content_items.scheduled_at IS 'When the article should be published (for scheduled posts)';
