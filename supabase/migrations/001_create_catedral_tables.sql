-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  desc_es TEXT,
  desc_en TEXT,
  price TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_bucket TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create general_info table
CREATE TABLE IF NOT EXISTS general_info (
  id TEXT PRIMARY KEY DEFAULT 'default',
  phone TEXT,
  email TEXT,
  address TEXT,
  map_url TEXT,
  schedule_es TEXT,
  schedule_en TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  whatsapp_group TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items
CREATE POLICY "Allow public read on menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write on menu_items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on menu_items" ON menu_items FOR UPDATE WITH CHECK (true);
CREATE POLICY "Allow authenticated delete on menu_items" ON menu_items FOR DELETE USING (true);

-- RLS Policies for gallery_items
CREATE POLICY "Allow public read on gallery_items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write on gallery_items" ON gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated delete on gallery_items" ON gallery_items FOR DELETE USING (true);

-- RLS Policies for general_info
CREATE POLICY "Allow public read on general_info" ON general_info FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write on general_info" ON general_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on general_info" ON general_info FOR UPDATE WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
