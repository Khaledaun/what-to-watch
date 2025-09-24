-- Fix missing created_at column in job_logs table
-- This migration adds the missing created_at column that was referenced in the code

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_logs' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE job_logs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Update existing records to have created_at = ts if created_at is null
UPDATE job_logs 
SET created_at = ts 
WHERE created_at IS NULL;

-- Add comment to the column
COMMENT ON COLUMN job_logs.created_at IS 'Timestamp when the log entry was created';
