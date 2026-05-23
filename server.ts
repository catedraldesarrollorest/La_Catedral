/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { initialMenuItems, initialGalleryItems, initialGeneralInfo } from './src/initialData.js';
import { AppState } from './src/types.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase credentials not found. Backend will work in fallback mode.');
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper to fetch state from Supabase or fallback to initial data
  const fetchStateFromSupabase = async (): Promise<AppState> => {
    if (!supabase) {
      return {
        menuItems: initialMenuItems,
        galleryItems: initialGalleryItems,
        generalInfo: initialGeneralInfo
      };
    }

    try {
      const [menuRes, galleryRes, infoRes] = await Promise.all([
        supabase.from('menu_items').select('*'),
        supabase.from('gallery_items').select('*'),
        supabase.from('general_info').select('*').eq('id', 'default')
      ]);

      const menuItems = (menuRes.data || []).map((item: any) => ({
        id: item.id,
        category: item.category,
        subcategory: item.subcategory,
        nameEs: item.name_es,
        nameEn: item.name_en,
        descEs: item.desc_es,
        descEn: item.desc_en,
        price: item.price,
        available: item.available
      }));

      const galleryItems = (galleryRes.data || []).map((item: any) => ({
        id: item.id,
        category: item.category,
        imageSrc: item.image_url
      }));

      const generalInfo = infoRes.data?.[0] ? {
        phone: infoRes.data[0].phone || '',
        email: infoRes.data[0].email || '',
        address: infoRes.data[0].address || '',
        mapUrl: infoRes.data[0].map_url || '',
        scheduleEs: infoRes.data[0].schedule_es || '',
        scheduleEn: infoRes.data[0].schedule_en || '',
        whatsapp: infoRes.data[0].whatsapp || '',
        instagram: infoRes.data[0].instagram || '',
        facebook: infoRes.data[0].facebook || '',
        whatsappGroup: infoRes.data[0].whatsapp_group || ''
      } : initialGeneralInfo;

      return { menuItems, galleryItems, generalInfo };
    } catch (err) {
      console.error('Error fetching from Supabase:', err);
      return {
        menuItems: initialMenuItems,
        galleryItems: initialGalleryItems,
        generalInfo: initialGeneralInfo
      };
    }
  };

  // API Route: Get complete state (supports both /api/state and /api/sync)
  const handleGetState = async (req: any, res: any) => {
    try {
      const state = await fetchStateFromSupabase();
      res.json(state);
    } catch (err) {
      console.error('Error fetching state:', err);
      res.status(500).json({ error: 'Error al cargar el estado del servidor.' });
    }
  };

  app.get('/api/state', handleGetState);
  app.get('/api/sync', handleGetState);

  // API Route: Update state (supports both /api/state and /api/sync)
  const handlePostState = async (req: any, res: any) => {
    try {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      if (!supabase) {
        return res.status(500).json({ error: 'Supabase not configured' });
      }

      // Save menu items - delete all first, then insert new ones
      await supabase.from('menu_items').delete().neq('id', '');

      if (newState.menuItems && newState.menuItems.length > 0) {
        const menuData = newState.menuItems.map((item: any) => ({
          id: item.id,
          category: item.category,
          subcategory: item.subcategory,
          name_es: item.nameEs,
          name_en: item.nameEn,
          desc_es: item.descEs,
          desc_en: item.descEn,
          price: item.price,
          available: item.available
        }));

        await supabase.from('menu_items').insert(menuData);
      }

      // Save gallery items
      if (newState.galleryItems && newState.galleryItems.length > 0) {
        const galleryData = newState.galleryItems.map((item: any) => ({
          id: item.id,
          category: item.category,
          image_url: item.imageSrc,
          image_bucket: item.imageSrc.includes('data:') ? null : 'gallery'
        }));

        await supabase.from('gallery_items').upsert(galleryData);
      }

      // Save general info
      if (newState.generalInfo) {
        const infoData = {
          id: 'default',
          phone: newState.generalInfo.phone,
          email: newState.generalInfo.email,
          address: newState.generalInfo.address,
          map_url: newState.generalInfo.mapUrl,
          schedule_es: newState.generalInfo.scheduleEs,
          schedule_en: newState.generalInfo.scheduleEn,
          whatsapp: newState.generalInfo.whatsapp,
          instagram: newState.generalInfo.instagram,
          facebook: newState.generalInfo.facebook,
          whatsapp_group: newState.generalInfo.whatsappGroup
        };

        await supabase.from('general_info').upsert(infoData);
      }

      const state = await fetchStateFromSupabase();
      res.json({ success: true, message: 'Se han guardado los cambios exitosamente.', state });
    } catch (err) {
      console.error('Failed to save state:', err);
      res.status(500).json({ error: 'Hubo un error al guardar los cambios en el servidor.' });
    }
  };

  app.post('/api/state', handlePostState);
  app.post('/api/sync', handlePostState);

  // === DIAGNOSTIC ENDPOINT ===
  app.get('/api/diagnostic', async (req, res) => {
    try {
      const state = await fetchStateFromSupabase();
      const diagnostic = {
        timestamp: new Date().toISOString(),
        supabaseConfigured: !!supabase,
        menuItemsCount: state.menuItems.length,
        firstMenuItem: state.menuItems[0] || null,
        allMenuItems: state.menuItems.map((item, idx) => ({
          idx,
          id: item.id,
          nameEs: item.nameEs,
          category: item.category,
          hasAllFields: !!(item.id && item.nameEs && item.category && item.price)
        })),
        validationErrors: state.menuItems
          .map((item, idx) => ({
            idx,
            id: item.id,
            errors: [
              !item.id ? 'missing id' : null,
              !item.nameEs ? 'missing nameEs' : null,
              !item.category ? 'missing category' : null,
              !item.price ? 'missing price' : null
            ].filter(Boolean)
          }))
          .filter(v => v.errors.length > 0)
      };
      res.json(diagnostic);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // API Route: Reset to defaults
  app.post('/api/state/reset', async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: 'Supabase not configured' });
      }

      // Clear and repopulate tables
      await supabase.from('menu_items').delete().neq('id', '');
      await supabase.from('gallery_items').delete().neq('id', '');

      const menuData = initialMenuItems.map((item) => ({
        id: item.id,
        category: item.category,
        subcategory: item.subcategory,
        name_es: item.nameEs,
        name_en: item.nameEn,
        desc_es: item.descEs,
        desc_en: item.descEn,
        price: item.price,
        available: item.available
      }));

      const galleryData = initialGalleryItems.map((item) => ({
        id: item.id,
        category: item.category,
        image_url: item.imageSrc
      }));

      await supabase.from('menu_items').insert(menuData);
      await supabase.from('gallery_items').insert(galleryData);

      const infoData = {
        id: 'default',
        phone: initialGeneralInfo.phone,
        email: initialGeneralInfo.email,
        address: initialGeneralInfo.address,
        map_url: initialGeneralInfo.mapUrl,
        schedule_es: initialGeneralInfo.scheduleEs,
        schedule_en: initialGeneralInfo.scheduleEn,
        whatsapp: initialGeneralInfo.whatsapp,
        instagram: initialGeneralInfo.instagram,
        facebook: initialGeneralInfo.facebook,
        whatsapp_group: initialGeneralInfo.whatsappGroup
      };

      await supabase.from('general_info').upsert(infoData);

      const state = await fetchStateFromSupabase();
      res.json({ success: true, message: 'Se ha restablecido el menú de fábrica.', state });
    } catch (err) {
      console.error('Error resetting state:', err);
      res.status(500).json({ error: 'Error al restablecer los valores de fábrica.' });
    }
  });

  // Serve Vite assets in development vs static SPA build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`La Catedral app server listening on http://localhost:${PORT}`);
    console.log(`Database: ${supabase ? 'Supabase ✓' : 'Fallback mode (no persistence)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to boot backend server', err);
});
