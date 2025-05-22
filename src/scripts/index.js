// CSS imports

import '../styles/styles.css';
import App from '../scripts/pages/app';

// Register Service Worker for Push Notification as early as possible
import('./utils/push-notification').then((pushNotif) => {
  pushNotif.registerServiceWorker().catch(() => {});
});

// PWA: Prompt install event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  // Optionally, show a custom install button
});

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const skipLink = document.querySelector('.skip-to-content');
  const mainContent = document.querySelector('#main-content');

  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault(); 
      mainContent.setAttribute('tabindex', '-1'); 
      mainContent.focus(); 
      mainContent.scrollIntoView({ behavior: 'smooth' }); 
    });
  }
});
