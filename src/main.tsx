import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import ErrorBoundary from App
import { ErrorBoundary } from './App.tsx';

// Global error handler (XSS-safe with textContent)
window.addEventListener('error', (event) => {
  console.error('🔴 GLOBAL ERROR:', event.error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 20px; background: #fee; color: #c00; font-family: monospace;';

  const title = document.createElement('h1');
  title.textContent = 'ERROR GLOBAL';

  const message = document.createElement('pre');
  message.textContent = event.error?.message || 'Unknown error';

  const stack = document.createElement('pre');
  stack.textContent = event.error?.stack || '';

  const button = document.createElement('button');
  button.textContent = 'RELOAD';
  button.onclick = () => location.reload();

  errorDiv.appendChild(title);
  errorDiv.appendChild(message);
  errorDiv.appendChild(stack);
  errorDiv.appendChild(button);

  document.body.innerHTML = '';
  document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 UNHANDLED REJECTION:', event.reason);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 20px; background: #fee; color: #c00; font-family: monospace;';

  const title = document.createElement('h1');
  title.textContent = 'UNHANDLED REJECTION';

  const message = document.createElement('pre');
  message.textContent = event.reason?.message || String(event.reason);

  const button = document.createElement('button');
  button.textContent = 'RELOAD';
  button.onclick = () => location.reload();

  errorDiv.appendChild(title);
  errorDiv.appendChild(message);
  errorDiv.appendChild(button);

  document.body.innerHTML = '';
  document.body.appendChild(errorDiv);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
