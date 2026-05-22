-- Drop the existing menu_items table and recreate with correct schema
DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  name_es VARCHAR NOT NULL,
  name_en VARCHAR NOT NULL,
  description_es TEXT,
  description_en TEXT,
  category VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  image_url VARCHAR,
  is_available BOOLEAN DEFAULT true,
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create fully permissive policies
CREATE POLICY "Public can read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public can insert menu_items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update menu_items" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete menu_items" ON menu_items FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_menu_category ON menu_items(category);
