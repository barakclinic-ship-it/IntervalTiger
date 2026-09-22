// Bump this version string every time TIGER's files change. It forces the
// old cache to be thrown away on activate, so an update actually reaches
// people who already installed the app to their home screen.
const CACHE_NAME = 'tiger-cache-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

// Network-first for the page itself (index.html / navigations), so that
// whenever the phone has internet, opening the app fetches the latest
// version straight from GitHub Pages instead of an old cached copy —
// falling back to the cached copy only when there's no connection.
// Everything else (icons, manifest) rarely changes, so it stays cache-first
// for speed.
self.addEventListener('fetch', function(event){
  if (event.request.method !== 'GET') return;

  var isPage = event.request.mode === 'navigate' ||
    event.request.url.indexOf('index.html') !== -1;

  if (isPage) {
    event.respondWith(
      fetch(event.request).then(function(response){
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        return caches.match(event.request).then(function(cached){
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached){
      if (cached) return cached;
      return fetch(event.request).then(function(response){
        if (response && response.status === 200 && response.type === 'basic') {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      });
    })
  );
});
