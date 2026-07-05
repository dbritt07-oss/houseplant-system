/* ============================================================
   sw.js  —  offline service worker
   Precaches the app shell so the app runs fully offline after
   the first load. Runtime-caches fonts. Plant DATA never lives
   here; it stays in IndexedDB on the device.
   ============================================================ */
const CACHE = "hps-v7";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./js/app.js",
  "./js/care.js",
  "./js/art.js",
  "./js/seed.js",
  "./js/db.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // App-shell + same-origin: cache-first, fall back to network, then cache the result.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html")))
    );
    return;
  }
  // Cross-origin (Google Fonts): stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; }).catch(() => hit);
      return hit || net;
    })
  );
});

/* Tapping a due-reminder notification focuses/opens the app. */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window" }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow("./index.html");
  }));
});
