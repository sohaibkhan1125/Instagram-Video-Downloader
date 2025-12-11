-- Migration script for Instagram Downloader website content
-- Table name: website_content_instagram_downloader
-- This table stores all text content for the Instagram downloader website

-- Create the table
CREATE TABLE IF NOT EXISTS website_content_instagram_downloader (
  id BIGSERIAL PRIMARY KEY,
  hero_title TEXT,
  hero_description TEXT,
  main_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE website_content_instagram_downloader ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access"
  ON website_content_instagram_downloader
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert/update
-- Note: You may want to restrict this further based on your auth setup
CREATE POLICY "Allow authenticated insert/update"
  ON website_content_instagram_downloader
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow anon users to insert/update (if you want admin panel without auth)
-- WARNING: This allows anyone to modify content. Remove this if you have authentication.
CREATE POLICY "Allow anon insert/update"
  ON website_content_instagram_downloader
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_website_content_instagram_downloader_created_at 
  ON website_content_instagram_downloader(created_at DESC);

-- Insert default content (optional)
INSERT INTO website_content_instagram_downloader (hero_title, hero_description, main_content)
VALUES (
  'Download Instagram & TikTok
Videos & Reels',
  'Save your favorite Instagram posts, reels, stories, photos and TikTok videos in high quality. Fast, secure, and completely free.',
  ''
)
ON CONFLICT DO NOTHING;

-- Enable realtime for this table (so changes appear instantly on the website)
ALTER PUBLICATION supabase_realtime ADD TABLE website_content_instagram_downloader;

COMMENT ON TABLE website_content_instagram_downloader IS 'Stores text content for the Instagram downloader website';
COMMENT ON COLUMN website_content_instagram_downloader.hero_title IS 'Hero section title (supports \n for line breaks)';
COMMENT ON COLUMN website_content_instagram_downloader.hero_description IS 'Hero section description text';
COMMENT ON COLUMN website_content_instagram_downloader.main_content IS 'Main content section HTML (from Froala editor)';
