import { useRef, useState, useCallback } from 'react'

const FADE_IN = 0.05   // 50ms fade in
const FADE_OUT = 0.15  // 150ms fade out

export interface PlayingInfo {
  id: string
  elapsed: number
  duration: number
}

interface PlayingEntry {
  source: AudioBufferSourceNode
  gain: GainNode
  startTime: number   // AudioContext time
  wallStart: number   // Date.now() — fallback timer
  duration: number
}

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map())
  const playingRef = useRef<Map<string, PlayingEntry>>(new Map())
  const [isReady, setIsReady] = useState(false)
  const [contextState, setContextState] = useState<AudioContextState>('suspended')

  function getContext(): AudioContext {
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      ctx.onstatechange = () => setContextState(ctx.state)
      setContextState(ctx.state)
      audioContextRef.current = ctx
      setIsReady(true)
    }
    return audioContextRef.current
  }

  // Clean up entries whose wall-clock time has expired
  function cleanupExpired() {
    const now = Date.now()
    for (const [id, entry] of playingRef.current) {
      const elapsed = (now - entry.wallStart) / 1000
      if (elapsed >= entry.duration + 0.2) {
        playingRef.current.delete(id)
      }
    }
  }

  const resume = useCallback(async (): Promise<void> => {
    const ctx = audioContextRef.current
    if (!ctx) return
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }
  }, [])

  const loadSound = useCallback(async (id: string, url: string): Promise<void> => {
    const ctx = getContext()
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      buffersRef.current.set(id, audioBuffer)
    } catch (err) {
      console.warn(`[useAudioEngine] Failed to load sound "${id}" from ${url}:`, err)
    }
  }, [])

  const isPlaying = useCallback((id: string): boolean => {
    cleanupExpired()
    return playingRef.current.has(id)
  }, [])

  const getPlaying = useCallback((): PlayingInfo[] => {
    cleanupExpired()
    const now = Date.now()
    const result: PlayingInfo[] = []
    for (const [id, entry] of playingRef.current) {
      const dur = entry.duration || 0
      const elapsed = Math.min((now - entry.wallStart) / 1000, dur)
      result.push({ id, elapsed: isNaN(elapsed) ? 0 : elapsed, duration: dur })
    }
    return result
  }, [])

  const playSound = useCallback((id: string): void => {
    const ctx = audioContextRef.current
    if (!ctx) return

    cleanupExpired()
    if (playingRef.current.has(id)) return

    const buffer = buffersRef.current.get(id)
    if (!buffer) return

    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const gain = ctx.createGain()
    const now = ctx.currentTime

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(1, now + FADE_IN)

    const duration = buffer.duration
    const fadeOutStart = Math.max(now + duration - FADE_OUT, now + FADE_IN)
    gain.gain.setValueAtTime(1, fadeOutStart)
    gain.gain.linearRampToValueAtTime(0, now + duration)

    source.connect(gain)
    gain.connect(ctx.destination)

    playingRef.current.set(id, {
      source,
      gain,
      startTime: now,
      wallStart: Date.now(),
      duration,
    })

    source.onended = () => {
      playingRef.current.delete(id)
    }

    // Fallback cleanup in case onended doesn't fire on mobile
    setTimeout(() => {
      if (playingRef.current.has(id)) {
        playingRef.current.delete(id)
      }
    }, (duration + 0.2) * 1000)

    source.start(0)
  }, [])

  return { loadSound, playSound, isPlaying, getPlaying, resume, isReady, contextState }
}
