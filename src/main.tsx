import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import ErrorBoundary from App
import { ErrorBoundary } from './App.tsx';

// Global error handler
window.addEventListener('error', (event) => {
  console.error('🔴 GLOBAL ERROR:', event.error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c00; font-family: monospace;">
      <h1>ERROR GLOBAL</h1>
      <pre>${event.error?.message || 'Unknown error'}</pre>
      <pre>${event.error?.stack || ''}</pre>
      <button onclick="location.reload()">RELOAD</button>
    </div>
  `;
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 UNHANDLED REJECTION:', event.reason);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c00; font-family: monospace;">
      <h1>UNHANDLED REJECTION</h1>
      <pre>${event.reason?.message || String(event.reason)}</pre>
      <button onclick="location.reload()">RELOAD</button>
    </div>
  `;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
