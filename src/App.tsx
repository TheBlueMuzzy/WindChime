import { useEffect, useRef, useState, type CSSProperties } from 'react'
import QrScanner from './components/QrScanner'
import { useAudioEngine } from './hooks/useAudioEngine'
import versionData from '../version.json'

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
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const audioUnlockedRef = useRef(false)
  const { loadSound, playSound, isPlaying, getPlaying, playingCount: _playingCount, stopAll, resume } = useAudioEngine()
  const soundsLoaded = useRef(false)
  const [nowPlaying, setNowPlaying] = useState<{ id: string; elapsed: number; duration: number }[]>([])
  const [debugLog, setDebugLog] = useState<string[]>([])

  function dbg(msg: string) {
    const t = new Date()
    const ts = `${t.getMinutes()}:${String(t.getSeconds()).padStart(2, '0')}.${String(t.getMilliseconds()).slice(0, 1)}`
    setDebugLog((prev) => [`${ts} ${msg}`, ...prev].slice(0, 10))
  }

  // --- Scan handler ---
  // Simple rule: when scanner reports a code, play it if not already playing.
  // No tracking of "visible" codes. No replay loops. One scan = one play.
  // Scanner fires onScan each cycle it detects codes (every scanDelay ms).
  // If code leaves frame and comes back, scanner fires again → plays again.
  const onScanRef = useRef((codes: { rawValue: string }[]) => {
    if (!audioUnlockedRef.current) return
    if (codes.length === 0) return

    const chimes = codes
      .map((c) => c.rawValue)
      .filter((v) => CHIME_IDS.has(v))

    if (chimes.length === 0) return

    setLastDetected(chimes.join(', '))
    setScanCount((c) => c + 1)

    for (const id of chimes) {
      if (!isPlaying(id)) {
        playSound(id)
        dbg(`▶ PLAY: ${id}`)
      }
    }

    dbg(`SCAN: ${chimes.length} chime(s)`)
  })

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

  // Pre-load all chime sounds once audio is unlocked (context resumed)
  useEffect(() => {
    if (!audioUnlocked) return
    if (soundsLoaded.current) return
    soundsLoaded.current = true
    let loaded = 0
    for (const id of CHIME_IDS) {
      loadSound(id, `${import.meta.env.BASE_URL}sounds/${id}.mp3`)
        .then(() => { loaded++; dbg(`Loaded ${loaded}/${CHIME_IDS.size}`) })
        .catch((err) => dbg(`FAIL ${id}: ${err}`))
    }
  }, [audioUnlocked, loadSound])

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
                  stopAll()
                  setLastDetected('')
                  setNowPlaying([])
                  dbg('AUDIO OFF')
                } else {
                  void resume().then(() => {
                    setAudioUnlocked(true)
                    audioUnlockedRef.current = true
                    dbg('AUDIO ON — scanning')
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
                  Tap anywhere to begin scanning
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
          {audioUnlocked ? 'ON' : 'OFF'} | Scans: {scanCount} | v{versionData.version}.{versionData.build}
        </div>
        {debugLog.map((line, i) => (
          <div key={i} style={{ opacity: 1 - i * 0.08 }}>{line}</div>
        ))}
      </div>

      {cameraStatus === 'denied' && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#fff', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Camera Access Blocked</h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.7, marginBottom: '1.25rem' }}>
            Wind Chime needs your camera to scan QR codes. Here's how to fix it:
          </p>
          {(() => {
            const ua = navigator.userAgent
            const isSafari = ua.includes('Safari') && !ua.includes('Chrome')
            const isChrome = ua.includes('Chrome')

            if (isChrome) {
              return (
                <ol style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', opacity: 0.9 }}>
                  <li>Tap the lock icon next to the address bar</li>
                  <li>Tap "Site settings"</li>
                  <li>Find "Camera" and change to "Allow"</li>
                  <li>Come back and tap Reload below</li>
                </ol>
              )
            }
            if (isSafari) {
              return (
                <ol style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', opacity: 0.9 }}>
                  <li>Open the Settings app on your phone</li>
                  <li>Scroll down and tap "Safari"</li>
                  <li>Tap "Camera" under "Settings for Websites"</li>
                  <li>Change to "Allow"</li>
                  <li>Come back and tap Reload below</li>
                </ol>
              )
            }
            // Generic fallback
            return (
              <ol style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', opacity: 0.9 }}>
                <li>Open your browser's settings</li>
                <li>Find site permissions or privacy settings</li>
                <li>Allow camera access for this site</li>
                <li>Come back and tap Reload below</li>
              </ol>
            )
          })()}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#fff',
              color: '#111',
              border: 'none',
              borderRadius: '6px',
              padding: '0.7rem 2rem',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
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
