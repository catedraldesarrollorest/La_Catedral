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
import fs from 'fs';
import { promises as fsPromises } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'public', 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to save base64 image to disk
const saveImageToDisk = async (base64Data: string, filename: string): Promise<string> => {
  try {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return base64Data; // Return original if not base64

    const ext = matches[1];
    const data = matches[2];
    const filepath = path.join(uploadsDir, filename);

    await fsPromises.writeFile(filepath, Buffer.from(data, 'base64'));
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving image:', err);
    return base64Data; // Fallback to original data
  }
};

// Function to convert file URL back to base64 for loading
const loadImageFromDisk = async (filepath: string): Promise<string> => {
  try {
    if (!filepath.startsWith('/uploads/')) return filepath;

    const fullPath = path.join(__dirname, 'public', filepath);
    const data = await fsPromises.readFile(fullPath);
    const ext = path.extname(fullPath).slice(1);
    return `data:image/${ext};base64,${data.toString('base64')}`;
  } catch (err) {
    console.error('Error loading image:', err);
    return filepath;
  }
};

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
  app.get('/api/state', async (req, res) => {
    // Convert file URLs back to base64 for images
    const stateToReturn = JSON.parse(JSON.stringify(appState));
    if (stateToReturn.coverPage) {
      const cp = stateToReturn.coverPage;
      if (cp.galleryPhoto1?.startsWith('/uploads')) {
        cp.galleryPhoto1 = await loadImageFromDisk(cp.galleryPhoto1);
      }
      if (cp.galleryPhoto2?.startsWith('/uploads')) {
        cp.galleryPhoto2 = await loadImageFromDisk(cp.galleryPhoto2);
      }
      if (cp.galleryPhoto3?.startsWith('/uploads')) {
        cp.galleryPhoto3 = await loadImageFromDisk(cp.galleryPhoto3);
      }
      if (cp.imageSrc?.startsWith('/uploads')) {
        cp.imageSrc = await loadImageFromDisk(cp.imageSrc);
      }
    }
    res.json(stateToReturn);
  });

  app.get('/api/sync', async (req, res) => {
    const stateToReturn = JSON.parse(JSON.stringify(appState));
    if (stateToReturn.coverPage) {
      const cp = stateToReturn.coverPage;
      if (cp.galleryPhoto1?.startsWith('/uploads')) {
        cp.galleryPhoto1 = await loadImageFromDisk(cp.galleryPhoto1);
      }
      if (cp.galleryPhoto2?.startsWith('/uploads')) {
        cp.galleryPhoto2 = await loadImageFromDisk(cp.galleryPhoto2);
      }
      if (cp.galleryPhoto3?.startsWith('/uploads')) {
        cp.galleryPhoto3 = await loadImageFromDisk(cp.galleryPhoto3);
      }
      if (cp.imageSrc?.startsWith('/uploads')) {
        cp.imageSrc = await loadImageFromDisk(cp.imageSrc);
      }
    }
    res.json(stateToReturn);
  });

  // POST /api/state - Update state
  app.post('/api/state', async (req, res) => {
    try {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      // Process cover page images
      if (newState.coverPage) {
        const cp = newState.coverPage;
        // Save gallery photos if they're base64 strings
        if (cp.galleryPhoto1 && cp.galleryPhoto1.startsWith('data:image')) {
          cp.galleryPhoto1 = await saveImageToDisk(cp.galleryPhoto1, 'gallery-photo-1.jpg');
        }
        if (cp.galleryPhoto2 && cp.galleryPhoto2.startsWith('data:image')) {
          cp.galleryPhoto2 = await saveImageToDisk(cp.galleryPhoto2, 'gallery-photo-2.jpg');
        }
        if (cp.galleryPhoto3 && cp.galleryPhoto3.startsWith('data:image')) {
          cp.galleryPhoto3 = await saveImageToDisk(cp.galleryPhoto3, 'gallery-photo-3.jpg');
        }
        if (cp.imageSrc && cp.imageSrc.startsWith('data:image')) {
          cp.imageSrc = await saveImageToDisk(cp.imageSrc, 'cover-image.jpg');
        }
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
      if (newState.coverPage !== undefined) {
        appState.coverPage = newState.coverPage;
      }

      console.log(`💾 State saved: ${appState.menuItems.length} menu items`);
      res.json({ success: true, state: appState });
    } catch (err) {
      console.error('Error saving state:', err);
      res.status(500).json({ error: 'Error al guardar los cambios.' });
    }
  });

  app.post('/api/sync', async (req, res) => {
    try {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      // Process cover page images
      if (newState.coverPage) {
        const cp = newState.coverPage;
        if (cp.galleryPhoto1 && cp.galleryPhoto1.startsWith('data:image')) {
          cp.galleryPhoto1 = await saveImageToDisk(cp.galleryPhoto1, 'gallery-photo-1.jpg');
        }
        if (cp.galleryPhoto2 && cp.galleryPhoto2.startsWith('data:image')) {
          cp.galleryPhoto2 = await saveImageToDisk(cp.galleryPhoto2, 'gallery-photo-2.jpg');
        }
        if (cp.galleryPhoto3 && cp.galleryPhoto3.startsWith('data:image')) {
          cp.galleryPhoto3 = await saveImageToDisk(cp.galleryPhoto3, 'gallery-photo-3.jpg');
        }
        if (cp.imageSrc && cp.imageSrc.startsWith('data:image')) {
          cp.imageSrc = await saveImageToDisk(cp.imageSrc, 'cover-image.jpg');
        }
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
      if (newState.coverPage !== undefined) {
        appState.coverPage = newState.coverPage;
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
        generalInfo: { ...initialGeneralInfo },
        coverPage: { ...initialCoverPage }
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

  // Serve uploaded images
  app.use('/uploads', express.static(uploadsDir));

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
