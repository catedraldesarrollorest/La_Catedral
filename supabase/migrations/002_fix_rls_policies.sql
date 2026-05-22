-- Drop existing RLS policies to ensure clean state
DROP POLICY IF EXISTS "Allow public read on menu_items" ON menu_items;
DROP POLICY IF EXISTS "Allow authenticated write on menu_items" ON menu_items;
DROP POLICY IF EXISTS "Allow authenticated update on menu_items" ON menu_items;
DROP POLICY IF EXISTS "Allow authenticated delete on menu_items" ON menu_items;
DROP POLICY IF EXISTS "Enable all access for public" ON menu_items;

DROP POLICY IF EXISTS "Allow public read on gallery_items" ON gallery_items;
DROP POLICY IF EXISTS "Allow authenticated write on gallery_items" ON gallery_items;
DROP POLICY IF EXISTS "Allow authenticated delete on gallery_items" ON gallery_items;
DROP POLICY IF EXISTS "Enable all access for public" ON gallery_items;

DROP POLICY IF EXISTS "Allow public read on general_info" ON general_info;
DROP POLICY IF EXISTS "Allow authenticated write on general_info" ON general_info;
DROP POLICY IF EXISTS "Allow authenticated update on general_info" ON general_info;
DROP POLICY IF EXISTS "Enable all access for public" ON general_info;

-- Create fully permissive policies for public access (anon key)
-- These policies allow the public (anon key) to read, insert, update, and delete data
CREATE POLICY "Public can read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public can insert menu_items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update menu_items" ON menu_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete menu_items" ON menu_items FOR DELETE USING (true);

CREATE POLICY "Public can read gallery_items" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public can insert gallery_items" ON gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update gallery_items" ON gallery_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete gallery_items" ON gallery_items FOR DELETE USING (true);

CREATE POLICY "Public can read general_info" ON general_info FOR SELECT USING (true);
CREATE POLICY "Public can insert general_info" ON general_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update general_info" ON general_info FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete general_info" ON general_info FOR DELETE USING (true);
