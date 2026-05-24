/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialMenuItems, initialGalleryItems, initialGeneralInfo, initialCoverPage } from './src/initialData.js';
import { AppState } from './src/types.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === IN-MEMORY STATE (Primary source of truth) ===
let appState: AppState = {
  menuItems: [...initialMenuItems],
  galleryItems: [...initialGalleryItems],
  generalInfo: { ...initialGeneralInfo },
  coverPage: { ...initialCoverPage }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  console.log(`✅ Server initialized with ${appState.menuItems.length} menu items`);

  // === API ROUTES ===

  // GET /api/state - Retrieve current state
  app.get('/api/state', (req, res) => {
    res.json(appState);
  });

  app.get('/api/sync', (req, res) => {
    res.json(appState);
  });

  // POST /api/state - Update state
  app.post('/api/state', (req, res) => {
    try {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      // Update state in memory
      if (newState.menuItems !== undefined) {
        appState.menuItems = newState.menuItems;
      }
      if (newState.galleryItems !== undefined) {
        appState.galleryItems = newState.galleryItems;
      }
      if (newState.generalInfo !== undefined) {
        appState.generalInfo = newState.generalInfo;
      }

      console.log(`💾 State saved: ${appState.menuItems.length} menu items`);
      res.json({ success: true, state: appState });
    } catch (err) {
      console.error('Error saving state:', err);
      res.status(500).json({ error: 'Error al guardar los cambios.' });
    }
  });

  app.post('/api/sync', (req, res) => {
    try {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      if (newState.menuItems !== undefined) {
        appState.menuItems = newState.menuItems;
      }
      if (newState.galleryItems !== undefined) {
        appState.galleryItems = newState.galleryItems;
      }
      if (newState.generalInfo !== undefined) {
        appState.generalInfo = newState.generalInfo;
      }

      console.log(`💾 Synced: ${appState.menuItems.length} menu items`);
      res.json({ success: true, state: appState });
    } catch (err) {
      console.error('Error syncing state:', err);
      res.status(500).json({ error: 'Error al sincronizar.' });
    }
  });

  // POST /api/state/reset - Reset to defaults
  app.post('/api/state/reset', (req, res) => {
    try {
      appState = {
        menuItems: [...initialMenuItems],
        galleryItems: [...initialGalleryItems],
        generalInfo: { ...initialGeneralInfo }
      };

      console.log(`🔄 Reset to defaults: ${appState.menuItems.length} menu items`);
      res.json({ success: true, message: 'Estado restablecido', state: appState });
    } catch (err) {
      console.error('Error resetting state:', err);
      res.status(500).json({ error: 'Error al restablecer.' });
    }
  });

  // GET /api/diagnostic - Diagnostic info
  app.get('/api/diagnostic', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      menuItemsCount: appState.menuItems.length,
      galleryItemsCount: appState.galleryItems.length,
      firstMenuItem: appState.menuItems[0] || null,
      sample: appState.menuItems.slice(0, 3).map(item => ({
        id: item.id,
        nameEs: item.nameEs,
        category: item.category,
        valid: !!(item.id && item.nameEs && item.category && item.price)
      }))
    });
  });

  // Serve Vite assets in development vs static SPA build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = await vite.transformIndexHtml(url, `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>La Catedral Restaurant</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        console.log((e as Error).stack);
        res.status(500).end((e as Error).message);
      }
    });
  } else {
    // Production: serve static files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 La Catedral server listening on http://localhost:${PORT}`);
    console.log(`📊 In-memory database with ${appState.menuItems.length} menu items\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
