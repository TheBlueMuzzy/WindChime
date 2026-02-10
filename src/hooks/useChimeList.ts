import { useState, useEffect } from 'react'

const GITHUB_API_URL = 'https://api.github.com/repos/TheBlueMuzzy/WindChime/contents/public/sounds'

export function useChimeList() {
  const [chimeIds, setChimeIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchChimes() {
      try {
        // Try GitHub API first
        const res = await fetch(GITHUB_API_URL)
        if (res.ok) {
          const files: { name: string }[] = await res.json()
          const ids = files
            .map(f => f.name)
            .filter(n => n.startsWith('Chime_') && n.endsWith('.mp3'))
            .map(n => n.replace('.mp3', ''))
            .sort()
          if (!cancelled) {
            setChimeIds(ids)
            setLoading(false)
            return
          }
        }
        throw new Error(`GitHub API returned ${res.status}`)
      } catch {
        // Fallback: fetch manifest.json
        try {
          const res = await fetch(`${import.meta.env.BASE_URL}sounds/manifest.json`)
          if (res.ok) {
            const ids: string[] = await res.json()
            if (!cancelled) {
              setChimeIds(ids)
              setLoading(false)
              return
            }
          }
          throw new Error('Manifest fetch failed')
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : 'Failed to load chime list')
            setLoading(false)
          }
        }
      }
    }

    fetchChimes()
    return () => { cancelled = true }
  }, [])

  return { chimeIds, loading, error }
}
