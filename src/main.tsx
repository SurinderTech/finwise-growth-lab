
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add mobile viewport meta tag if not present
const addMobileViewport = () => {
  const existingViewport = document.querySelector('meta[name="viewport"]');
  if (!existingViewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);
  }
};

// Add mobile-friendly meta tags
const addMobileMeta = () => {
  // Add theme color for mobile browsers
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#10b981';
  document.head.appendChild(themeColor);

  // Add apple mobile web app capable
  const appleMeta = document.createElement('meta');
  appleMeta.name = 'apple-mobile-web-app-capable';
  appleMeta.content = 'yes';
  document.head.appendChild(appleMeta);

  // Add apple status bar style
  const appleStatusBar = document.createElement('meta');
  appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
  appleStatusBar.content = 'black-translucent';
  document.head.appendChild(appleStatusBar);
};

addMobileViewport();
addMobileMeta();

createRoot(document.getElementById("root")!).render(<App />);
