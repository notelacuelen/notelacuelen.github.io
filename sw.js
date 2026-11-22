// Service worker del comprobador «¿Es estafa?»: solo guarda la página del comprobador y sus iconos para usarla sin conexión.
const C = "comprobador-v1";
const ARCH = ["/comprobador", "/manifest.webmanifest", "/icono-192.png", "/icono-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(ARCH))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || !ARCH.includes(u.pathname.replace(/\.html$/, ""))) return;
  // red primero (para tener siempre la última versión) y, sin conexión, la copia guardada
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true})));
});
