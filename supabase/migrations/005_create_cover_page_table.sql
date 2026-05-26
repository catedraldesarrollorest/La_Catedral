-- Create cover_page table for portada editor
CREATE TABLE cover_page (
  id TEXT PRIMARY KEY DEFAULT 'default',
  image_src TEXT DEFAULT 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
  image_height INTEGER DEFAULT 250,
  title_es TEXT DEFAULT 'La Catedral',
  title_en TEXT DEFAULT 'La Catedral',
  subtitle_es TEXT DEFAULT 'Restaurante Cubano Auténtico',
  subtitle_en TEXT DEFAULT 'Authentic Cuban Restaurant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cover_page ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to cover_page"
  ON cover_page
  FOR SELECT
  USING (TRUE);

-- Create policy to allow anonymous inserts/updates
CREATE POLICY "Allow anonymous insert/update on cover_page"
  ON cover_page
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Allow anonymous update on cover_page"
  ON cover_page
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Insert default data
INSERT INTO cover_page (id, image_src, image_height, title_es, title_en, subtitle_es, subtitle_en)
VALUES (
  'default',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
  250,
  'La Catedral',
  'La Catedral',
  'Restaurante Cubano Auténtico',
  'Authentic Cuban Restaurant'
)
ON CONFLICT (id) DO UPDATE SET
  image_src = EXCLUDED.image_src,
  image_height = EXCLUDED.image_height,
  title_es = EXCLUDED.title_es,
  title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es,
  subtitle_en = EXCLUDED.subtitle_en;
