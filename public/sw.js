const CACHE = 'nomadiq-v1'
const OFFLINE_URL = '/'

const PRECACHE = [
  '/',
  '/manifest.json',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// `res.clone()` must be called BEFORE the original response body is consumed.
// Calling it inside an async `caches.open(...).then(...)` race-conditions with
// the browser reading `res`, which throws "Response body is already used".
function cachePut(request, res) {
  const clone = res.clone()
  caches.open(CACHE).then(c => c.put(request, clone)).catch(() => {})
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  // Skip non-GET and chrome-extension
  if (e.request.method !== 'GET' || url.protocol === 'chrome-extension:') return

  // Firebase / API calls → network only
  if (url.hostname.includes('firestore') || url.hostname.includes('firebase') || url.hostname.includes('googleapis.com')) return

  // Weather API → network first, fall back to cache
  if (url.hostname.includes('open-meteo.com')) {
    e.respondWith(
      fetch(e.request)
        .then(res => { cachePut(e.request, res); return res })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // Images (Unsplash) → cache first
  if (url.hostname.includes('unsplash.com') || e.request.destination === 'image') {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        if (res.ok) cachePut(e.request, res)
        return res
      }))
    )
    return
  }

  // Google Fonts → cache first
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        cachePut(e.request, res)
        return res
      }))
    )
    return
  }

  // App shell (JS/CSS/HTML) → network first, cache fallback
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) cachePut(e.request, res)
        return res
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match(OFFLINE_URL)))
  )
})
