import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/globals.css';
import './i18n';

// Disable context menu in production
if (!import.meta.env.DEV) {
  document.addEventListener('contextmenu', (e) => {
    const isDevMode = localStorage.getItem('tshock_dev_mode') === 'true';
    if (!isDevMode) {
      e.preventDefault();
    }
  });
}

// Disable certain hotkeys (refresh, zoom)
document.addEventListener('keydown', (e) => {
  const isDevMode = localStorage.getItem('tshock_dev_mode') === 'true';

  if (
    (e.ctrlKey &&
      (e.key === 'r' || e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) ||
    (e.metaKey &&
      (e.key === 'r' || e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) ||
    e.key === 'F5' ||
    e.key === 'F12'
  ) {
    if (!import.meta.env.DEV && !isDevMode) {
      e.preventDefault();
    }
  }
});

// Disable mouse wheel zoom
document.addEventListener(
  'wheel',
  (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
