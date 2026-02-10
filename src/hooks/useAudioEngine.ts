import { useRef, useState, useCallback } from 'react'

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map())
  const [isReady, setIsReady] = useState(false)

  // Lazily create the AudioContext on first use
  function getContext(): AudioContext {
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioContextRef.current = new AudioCtx()
      setIsReady(true)
    }
    return audioContextRef.current
  }

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

  const playSound = useCallback((id: string): void => {
    const ctx = audioContextRef.current
    if (!ctx) {
      console.warn('[useAudioEngine] AudioContext not initialized yet')
      return
    }

    const buffer = buffersRef.current.get(id)
    if (!buffer) {
      console.warn(`[useAudioEngine] No buffer found for sound "${id}"`)
      return
    }

    // Resume context if it was suspended (e.g. mobile autoplay policy)
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    source.start(0)
  }, [])

  return { loadSound, playSound, isReady }
}
