-- Create cover_page table
CREATE TABLE IF NOT EXISTS cover_page (
  id TEXT PRIMARY KEY DEFAULT 'default',
  image_src TEXT,
  image_height INTEGER DEFAULT 250,
  title_es TEXT,
  title_en TEXT,
  subtitle_es TEXT,
  subtitle_en TEXT,
  gallery_photo_1 TEXT,
  gallery_photo_2 TEXT,
  gallery_photo_3 TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cover_page ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cover_page
CREATE POLICY "Allow public read on cover_page" ON cover_page FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write on cover_page" ON cover_page FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on cover_page" ON cover_page FOR UPDATE WITH CHECK (true);
