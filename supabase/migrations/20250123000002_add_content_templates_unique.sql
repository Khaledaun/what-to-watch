-- Add unique constraint to content_templates table
ALTER TABLE content_templates ADD CONSTRAINT IF NOT EXISTS content_templates_kind_name_key UNIQUE (kind, name);
