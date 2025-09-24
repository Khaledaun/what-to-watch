-- Content Management System Tables
-- This migration adds tables for article management, SEO crawling, and content generation

-- Article Topics Table
CREATE TABLE IF NOT EXISTS article_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  target_keywords TEXT[] DEFAULT '{}',
  long_tail_keywords TEXT[] DEFAULT '{}',
  authority_links JSONB DEFAULT '[]',
  content_outline TEXT[] DEFAULT '{}',
  seo_data JSONB DEFAULT '{}',
  estimated_word_count INTEGER DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('draft', 'approved', 'rejected')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Items Table (Articles) - Note: content_items table is defined in main migration
-- This migration only adds additional columns if needed

-- SEO Crawl Results Table
CREATE TABLE IF NOT EXISTS seo_crawl_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  status TEXT CHECK (status IN ('success', 'warning', 'error')) NOT NULL,
  issues JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  crawled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_topics_status ON article_topics(status);
CREATE INDEX IF NOT EXISTS idx_article_topics_category ON article_topics(category);
CREATE INDEX IF NOT EXISTS idx_article_topics_generated_at ON article_topics(generated_at);

-- Note: content_items indexes are defined in main migration

CREATE INDEX IF NOT EXISTS idx_seo_crawl_results_url ON seo_crawl_results(url);
CREATE INDEX IF NOT EXISTS idx_seo_crawl_results_crawled_at ON seo_crawl_results(crawled_at);
CREATE INDEX IF NOT EXISTS idx_seo_crawl_results_status ON seo_crawl_results(status);

-- RLS Policies
ALTER TABLE article_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_crawl_results ENABLE ROW LEVEL SECURITY;

-- Note: content_items RLS policies are defined in main migration

-- Admin access for all content management
CREATE POLICY "Admin access for article topics" ON article_topics
  FOR ALL USING (true);

CREATE POLICY "Admin access for SEO crawl results" ON seo_crawl_results
  FOR ALL USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_article_topics_updated_at
  BEFORE UPDATE ON article_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: content_items trigger is defined in main migration

-- Sample data for testing
INSERT INTO article_topics (id, title, slug, category, target_keywords, long_tail_keywords, content_outline, estimated_word_count, difficulty, priority, status) VALUES
(
  'sample-topic-1',
  'Top 10 Action Movies on Netflix in 2024',
  'top-10-action-movies-netflix-2024',
  'Movie Lists',
  ARRAY['action movies netflix', 'best action movies 2024', 'netflix action films'],
  ARRAY['best action movies on netflix right now', 'top rated action movies netflix 2024', 'new action movies on netflix this year'],
  ARRAY['Introduction to action movies on Netflix', 'Criteria for selection', 'Top 10 movies with detailed reviews', 'Where to watch each movie', 'Conclusion and recommendations'],
  2500,
  'medium',
  'high',
  'draft'
),
(
  'sample-topic-2',
  'How to Watch Popular Movies on All Streaming Platforms',
  'how-to-watch-movies-all-platforms',
  'Streaming Guides',
  ARRAY['how to watch movies', 'streaming platforms guide', 'where to watch films'],
  ARRAY['how to watch movies on all streaming services', 'complete guide to streaming platforms', 'where to find movies online legally'],
  ARRAY['Introduction to streaming platforms', 'Platform-by-platform guide', 'Cost comparison', 'Content availability', 'Tips for finding specific movies'],
  2000,
  'easy',
  'medium',
  'draft'
);

-- Comments for documentation
COMMENT ON TABLE article_topics IS 'AI-generated article topics with SEO data and content outlines';
COMMENT ON TABLE content_items IS 'Published articles and content with SEO optimization';
COMMENT ON TABLE seo_crawl_results IS 'Daily SEO crawl results for website monitoring';

COMMENT ON COLUMN article_topics.target_keywords IS 'Primary keywords for SEO targeting';
COMMENT ON COLUMN article_topics.long_tail_keywords IS 'Long-tail keywords for better search ranking';
COMMENT ON COLUMN article_topics.authority_links IS 'High-authority links for content credibility';
COMMENT ON COLUMN article_topics.seo_data IS 'Complete SEO metadata including meta tags and structured data';

-- Note: content_items column comments are defined in main migration

COMMENT ON COLUMN seo_crawl_results.issues IS 'Array of SEO issues found during crawl';
COMMENT ON COLUMN seo_crawl_results.metrics IS 'Performance and technical metrics from crawl';
