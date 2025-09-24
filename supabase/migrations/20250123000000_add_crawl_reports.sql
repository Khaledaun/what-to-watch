-- Create crawl_reports table for monitoring website health
CREATE TABLE IF NOT EXISTS crawl_reports (
  id SERIAL PRIMARY KEY,
  total_urls INTEGER NOT NULL,
  success_count INTEGER NOT NULL,
  error_count INTEGER NOT NULL,
  four_oh_four_count INTEGER NOT NULL,
  average_response_time DECIMAL(10,2) NOT NULL,
  errors JSONB DEFAULT '[]'::jsonb,
  four_oh_fours JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crawl_reports_created_at ON crawl_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crawl_reports_four_oh_four_count ON crawl_reports(four_oh_four_count);

-- Add RLS policies
ALTER TABLE crawl_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read access for monitoring
CREATE POLICY "Allow public read access to crawl reports" ON crawl_reports
  FOR SELECT USING (true);

-- Allow service role to insert crawl reports
CREATE POLICY "Allow service role to insert crawl reports" ON crawl_reports
  FOR INSERT WITH CHECK (true);

-- Allow service role to update crawl reports
CREATE POLICY "Allow service role to update crawl reports" ON crawl_reports
  FOR UPDATE USING (true);

-- Allow service role to delete old crawl reports
CREATE POLICY "Allow service role to delete crawl reports" ON crawl_reports
  FOR DELETE USING (true);

