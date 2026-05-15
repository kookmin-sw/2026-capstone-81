import { useState, useEffect } from 'react'

// Fetch the main image of a Wikipedia article via its public REST summary endpoint.
// CORS-enabled, no auth, no quota for normal usage. Returns null if no image.
// Cached in sessionStorage so we hit Wikipedia at most once per article per session.

const CACHE_PREFIX = 'wiki-img:'
const MISS_VALUE   = '__none__'

async function fetchWikiImage(title) {
  if (!title) return null
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    return data?.originalimage?.source ?? data?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

export function useWikiImage(title, fallback) {
  const [src, setSrc] = useState(() => {
    if (!title) return fallback
    const cached = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(CACHE_PREFIX + title)
    if (cached === MISS_VALUE) return fallback
    if (cached) return cached
    return fallback
  })

  useEffect(() => {
    if (!title) return
    const cached = sessionStorage.getItem(CACHE_PREFIX + title)
    if (cached) return // already resolved (hit or miss)

    let cancelled = false
    fetchWikiImage(title).then(img => {
      if (cancelled) return
      if (img) {
        sessionStorage.setItem(CACHE_PREFIX + title, img)
        setSrc(img)
      } else {
        sessionStorage.setItem(CACHE_PREFIX + title, MISS_VALUE)
      }
    })
    return () => { cancelled = true }
  }, [title])

  return src
}
