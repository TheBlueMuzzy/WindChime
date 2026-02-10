import { useEffect, useRef, useState, type CSSProperties } from 'react'
import QrScanner from './components/QrScanner'
import { useAudioEngine } from './hooks/useAudioEngine'

/** All valid chime IDs — QR codes encode these values directly. */
const CHIME_IDS = new Set([
  'Chime_01', 'Chime_02', 'Chime_03', 'Chime_04', 'Chime_05', 'Chime_06',
  'Chime_07', 'Chime_08', 'Chime_09', 'Chime_10', 'Chime_11', 'Chime_12',
  'Chime_13', 'Chime_14', 'Chime_15', 'Chime_16', 'Chime_17', 'Chime_18',
  'Chime_19', 'Chime_20', 'Chime_21', 'Chime_22', 'Chime_23', 'Chime_24',
])

type CameraStatus = 'loading' | 'active' | 'denied' | 'error'

function App() {
  const [lastDetected, setLastDetected] = useState('')
  const [scanCount, setScanCount] = useState(0)
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading')
  const cameraContainerRef = useRef<HTMLDivElement>(null)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const audioUnlockedRef = useRef(false)
  const { loadSound, playSound, isPlaying, getPlaying, resume } = useAudioEngine()
  const soundsLoaded = useRef(false)
  const [nowPlaying, setNowPlaying] = useState<{ id: string; elapsed: number; duration: number }[]>([])
  const [debugLog, setDebugLog] = useState<string[]>([])

  // Track which chime codes are currently visible in the camera
  const visibleCodesRef = useRef<Map<string, number>>(new Map()) // code → last seen timestamp

  function dbg(msg: string) {
    const t = new Date()
    const ts = `${t.getMinutes()}:${String(t.getSeconds()).padStart(2, '0')}.${String(t.getMilliseconds()).slice(0, 1)}`
    setDebugLog((prev) => [`${ts} ${msg}`, ...prev].slice(0, 10))
  }

  // Scan handler — updates visible codes set, plays NEW codes immediately
  // Scanner only fires onScan when the detected set CHANGES, so we treat
  // the last reported set as current truth until a new scan says otherwise.
  const onScanRef = useRef((codes: { rawValue: string }[]) => {
    if (clearTimer.current) clearTimeout(clearTimer.current)
    if (codes.length > 0) {
      const values = codes.map((c) => c.rawValue).join(', ')
      setLastDetected(values)
      setScanCount((c) => c + 1)

      // Build new visible set from this scan (only valid chimes)
      const newVisible = new Set<string>()
      for (const code of codes) {
        if (CHIME_IDS.has(code.rawValue)) newVisible.add(code.rawValue)
      }

      // Detect codes that just entered the frame
      for (const id of newVisible) {
        if (!visibleCodesRef.current.has(id)) {
          // New code — play immediately
          if (audioUnlockedRef.current && !isPlaying(id)) {
            playSound(id)
            dbg(`▶ NEW: ${id}`)
          }
        }
      }

      // Detect codes that just left the frame
      for (const id of visibleCodesRef.current.keys()) {
        if (!newVisible.has(id)) {
          dbg(`EXIT: ${id}`)
        }
      }

      // Replace visible set with what the scanner just reported
      visibleCodesRef.current = new Map([...newVisible].map(id => [id, Date.now()]))
      dbg(`SCAN: ${codes.length} — vis:${visibleCodesRef.current.size}`)
    }
    clearTimer.current = setTimeout(() => {
      setLastDetected('')
    }, 2000)
  })

  // Replay interval — checks every 500ms for sounds that finished but code is still in view
  useEffect(() => {
    if (!audioUnlocked) return
    const interval = setInterval(() => {
      // Replay any visible code whose sound has finished
      for (const id of visibleCodesRef.current.keys()) {
        if (!isPlaying(id)) {
          playSound(id)
          dbg(`▶ REPLAY: ${id}`)
        }
      }
    }, 500)
    return () => clearInterval(interval)
  }, [audioUnlocked, isPlaying, playSound])

  // Error handler via ref
  const onErrorRef = useRef((error: unknown) => {
    console.error(error)
    if (
      error instanceof DOMException &&
      (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
    ) {
      setCameraStatus('denied')
    } else {
      setCameraStatus('error')
    }
  })

  // Poll playing state at 10fps — only when audio is active
  useEffect(() => {
    if (!audioUnlocked) return
    const interval = setInterval(() => {
      const playing = getPlaying()
      setNowPlaying((prev) => {
        if (playing.length === 0 && prev.length === 0) return prev
        return playing
      })
    }, 100)
    return () => clearInterval(interval)
  }, [getPlaying, audioUnlocked])

  // Pre-load all chime sounds on mount
  useEffect(() => {
    if (!soundsLoaded.current) {
      soundsLoaded.current = true
      for (const id of CHIME_IDS) {
        void loadSound(id, `/sounds/${id}.mp3`)
      }
    }
  }, [loadSound])

  // Detect camera active by polling for a playing <video>
  useEffect(() => {
    if (cameraStatus !== 'loading') return
    const interval = setInterval(() => {
      const video = cameraContainerRef.current?.querySelector('video')
      if (video && video.readyState >= 2) {
        setCameraStatus('active')
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [cameraStatus])

  const fullScreenContainer = {
    width: '100dvw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111',
  } as const

  const cameraContainer = {
    position: 'relative' as const,
    width: '95%',
    height: '85%',
    borderRadius: '8px',
    overflow: 'hidden',
  }

  const showScanner = cameraStatus === 'loading' || cameraStatus === 'active'

  return (
    <div style={fullScreenContainer}>
      {showScanner && (
        <div ref={cameraContainerRef} style={cameraContainer}>
          <QrScanner onScanRef={onScanRef} onErrorRef={onErrorRef} />
          {/* Detected code display */}
          {lastDetected && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#0f0',
                fontSize: '0.8rem',
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px 10px',
                borderRadius: '4px',
                zIndex: 5,
              }}
            >
              Detected: {lastDetected}{scanCount ? ` (scan #${scanCount})` : ''}
            </span>
          )}
          {cameraStatus === 'loading' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                }}
              >
                Starting camera...
              </span>
            </div>
          )}
          {cameraStatus === 'active' && (
            <div
              onClick={() => {
                if (audioUnlocked) {
                  setAudioUnlocked(false)
                  audioUnlockedRef.current = false
                } else {
                  void resume().then(() => {
                    setAudioUnlocked(true)
                    audioUnlockedRef.current = true
                  })
                }
              }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: audioUnlocked ? 'transparent' : 'rgba(0, 0, 0, 0.7)',
                zIndex: 20,
                cursor: 'pointer',
              }}
            >
              {!audioUnlocked && (
                <span
                  style={{
                    color: '#fff',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '1rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }}
                >
                  Tap anywhere to enable sound
                </span>
              )}
            </div>
          )}
          {/* Currently Playing */}
          {nowPlaying.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <div
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.2rem',
                }}
              >
                Currently Playing
              </div>
              {nowPlaying.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: 'rgba(0,0,0,0.75)',
                    color: '#0f0',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.8rem',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  } as CSSProperties}
                >
                  {s.id}: {s.elapsed.toFixed(1)}/{s.duration.toFixed(1)}s
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Debug log — bottom of screen, outside camera */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.9)',
          color: '#0f0',
          fontFamily: 'monospace',
          fontSize: '0.65rem',
          padding: '0.3rem 0.5rem',
          maxHeight: '20vh',
          overflow: 'hidden',
          zIndex: 50,
        }}
      >
        <div style={{ color: '#ff0', marginBottom: '0.15rem' }}>
          🔊 {audioUnlocked ? 'ON' : 'OFF'} | Scans: {scanCount}
        </div>
        {debugLog.map((line, i) => (
          <div key={i} style={{ opacity: 1 - i * 0.08 }}>{line}</div>
        ))}
      </div>

      {cameraStatus === 'denied' && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Camera access needed</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.8, maxWidth: '320px' }}>
            This app needs your camera to scan QR codes. Please allow camera access in your browser
            settings.
          </p>
        </div>
      )}

      {cameraStatus === 'error' && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Camera unavailable</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.8, maxWidth: '320px', marginBottom: '1.25rem' }}>
            Something went wrong accessing your camera. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#fff',
              color: '#111',
              border: 'none',
              borderRadius: '6px',
              padding: '0.6rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default App
