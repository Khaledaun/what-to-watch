-- Add unique constraint to content_templates table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'content_templates_kind_name_key'
    ) THEN
        ALTER TABLE content_templates ADD CONSTRAINT content_templates_kind_name_key UNIQUE (kind, name);
    END IF;
END $$;
