// === PWA: Application Shell & Offline Support ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('storyapp2-shell-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/public/manifest.json',
        '/public/images/logo.png',
        '/public/images/marker-icon.png',
        '/public/images/marker-icon-2x.png',
        '/public/images/marker-shadow.png',
        // Tambahkan file statis utama lain jika perlu
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.filter((key) => key !== 'storyapp2-shell-v1')
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Fallback offline shell
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
// Service Worker for StoryApp 2 Push Notification

// Hanya tampilkan notifikasi jika masih ada subscription aktif
self.addEventListener('push', async function(event) {
  let data = {};
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data = { title: 'Story Notification', options: { body: event.data && event.data.text() } };
  }
  const title = data.title || 'Story Notification';
  const options = data.options || {
    body: 'Ada notifikasi baru dari StoryApp!',
  };
  options.icon = options.icon || '/images/logo.png';
  options.badge = options.badge || '/images/logo.png';

  // Cek apakah masih ada subscription aktif
  const subs = await self.registration.pushManager.getSubscription();
  if (subs) {
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
