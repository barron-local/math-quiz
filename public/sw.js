// Service Worker for Math Quiz PWA
const CACHE_NAME = 'math-quiz-v2'

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './pwa-192x192.png?v=2',
  './pwa-512x512.png?v=2',
  './pwa-icon.svg?v=2'
]

// Install event: cache core shell files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA initial cache warning:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Listen for skip waiting command when user taps update button
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Fetch event: network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  // Skip cross-origin or chrome extensions
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Never cache version.json so realtime update checks are always instant
  if (event.request.url.includes('version.json')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }))
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // If HTML navigation, return root
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html')
          }
        })
      })
  )
})
