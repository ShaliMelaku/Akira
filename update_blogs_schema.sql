-- Update Blogs Table with new fields
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS related_link TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS content_raw TEXT; -- For detailed article content
