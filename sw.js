/* Service Worker: macht die App installierbar und offline nutzbar.
   Strategie "erst Internet, dann Speicher": Bei Netz immer die neueste Version,
   im Funkloch die zuletzt geladene. Kartenbilder (OpenStreetMap) werden nicht gespeichert. */
var CACHE = 'augsburg05-v1';
var FILES = ['./', 'index.html', 'css/style.css', 'js/logic.js', 'js/data.js', 'js/app.js',
  'vendor/leaflet/leaflet.css', 'vendor/leaflet/leaflet.js', 'img/hero.jpg',
  'img/crew1.jpg', 'img/crew2.jpg', 'img/crew3.jpg', 'img/icons/icon-192.png', 'manifest.webmanifest'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).catch(function () {}));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Karten usw. direkt aus dem Netz
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});
