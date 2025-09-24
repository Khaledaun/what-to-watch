-- Add poster_path and backdrop_path columns to titles table
ALTER TABLE titles ADD COLUMN IF NOT EXISTS poster_path TEXT;
ALTER TABLE titles ADD COLUMN IF NOT EXISTS backdrop_path TEXT;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_titles_poster_path ON titles(poster_path) WHERE poster_path IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_titles_backdrop_path ON titles(backdrop_path) WHERE backdrop_path IS NOT NULL;
