/* Service Worker — Traductor de Hábitos | RavenTechs | v2.0 | 02/11/2026
   Modo "red primero": siempre intenta traer la versión nueva; si no hay conexión usa la copia guardada.
   Sube CACHE en cada cambio para que los celulares se actualicen solos. */
var CACHE = 'habitos-v2.0';
var SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = req.url;
  if (url.indexOf(self.location.origin) !== 0) return; // solo archivos propios (Firebase, Google y la IA van directo)
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200) { var copia = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
      return res;
    }).catch(function () { return caches.match(req).then(function (c) { return c || caches.match('/index.html'); }); })
  );
});
