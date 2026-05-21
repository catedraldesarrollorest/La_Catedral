/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialMenuItems, initialGalleryItems, initialGeneralInfo } from './src/initialData.js';
import { AppState } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: increase json body limit to allow uploading Base64 photos smoothly
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // File path to persist state
  const dataFilePath = path.join(process.cwd(), 'data.json');

  // Load state from file or initialize with gorgeous defaults
  let state: AppState = {
    menuItems: initialMenuItems,
    galleryItems: initialGalleryItems,
    generalInfo: initialGeneralInfo
  };

  if (fs.existsSync(dataFilePath)) {
    try {
      const persistedState = fs.readFileSync(dataFilePath, 'utf8');
      state = JSON.parse(persistedState);
      console.log('Successfully loaded persisted menu and gallery state from data.json');
    } catch (err) {
      console.error('Failed to parse persistent data.json. Falling back to default data.', err);
    }
  } else {
    // Write defaults to file
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(state, null, 2), 'utf8');
      console.log('Created default data.json template on disk.');
    } catch (err) {
      console.error('Failed to write default data.json to disk', err);
    }
  }

  // API Route: Get complete state
  app.get('/api/state', (req, res) => {
    res.json(state);
  });

  // API Route: Update state
  app.post('/api/state', (req, res) => {
    try {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      // Update in-memory state
      if (newState.menuItems) state.menuItems = newState.menuItems;
      if (newState.galleryItems) state.galleryItems = newState.galleryItems;
      if (newState.generalInfo) state.generalInfo = newState.generalInfo;

      // Persist to fs
      fs.writeFileSync(dataFilePath, JSON.stringify(state, null, 2), 'utf8');
      console.log('Successfully saved updated menu/gallery state to data.json');

      res.json({ success: true, message: 'Se han guardado los cambios exitosamente.', state });
    } catch (err) {
      console.error('Failed to save state from backoffice request', err);
      res.status(500).json({ error: 'Hubo un error al guardar los cambios en el servidor.' });
    }
  });

  // API Route: Reset to defaults
  app.post('/api/state/reset', (req, res) => {
    try {
      state = {
        menuItems: initialMenuItems,
        galleryItems: initialGalleryItems,
        generalInfo: initialGeneralInfo
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(state, null, 2), 'utf8');
      res.json({ success: true, message: 'Se ha restablecido el menú de fábrica.', state });
    } catch (err) {
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
  });
}

startServer().catch((err) => {
  console.error('Failed to boot backend server', err);
});
