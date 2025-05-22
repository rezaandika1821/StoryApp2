// src/scripts/utils/push-notification.js
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register('/sw.js');
  }
  throw new Error('Service Worker not supported');
}

export async function subscribePushNotification(token) {
  const registration = await registerServiceWorker();
  if (!('PushManager' in window)) throw new Error('Push not supported');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
  // Kirim subscription ke server
  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  return subscription;
}

export async function unsubscribePushNotification(token) {
  const registration = await registerServiceWorker();
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    // Hapus dari server
    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    // Hapus dari browser
    const unsubResult = await subscription.unsubscribe();
    // Pastikan benar-benar unsubscribed
    const check = await registration.pushManager.getSubscription();
    if (check) {
      // Coba unsubscribe ulang jika masih ada
      try { await check.unsubscribe(); } catch {}
    }
  }
}

export async function isPushSubscribed() {
  if (!('serviceWorker' in navigator)) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return false;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}
