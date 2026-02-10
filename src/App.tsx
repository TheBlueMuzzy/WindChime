import { useEffect, useRef, useState } from 'react'
import QrScanner from './components/QrScanner'
import { useAudioEngine } from './hooks/useAudioEngine'
import { SOUND_MAP } from './config/sounds'

type CameraStatus = 'loading' | 'active' | 'denied' | 'error'

function App() {
  const [lastDetected, setLastDetected] = useState('')
  const [scanCount, setScanCount] = useState(0)
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading')
  const hasActivated = useRef(false)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const { loadSound, playSound, resume, contextState } = useAudioEngine()
  const soundsLoaded = useRef(false)

  // Pre-load all sounds from SOUND_MAP on mount
  useEffect(() => {
    if (!soundsLoaded.current) {
      soundsLoaded.current = true
      for (const [id, url] of Object.entries(SOUND_MAP)) {
        void loadSound(id, url)
      }
    }
  }, [loadSound])

  // Auto-unlock if AudioContext resumes on its own (some Android browsers)
  useEffect(() => {
    if (contextState === 'running') {
      setAudioUnlocked(true)
    }
  }, [contextState])

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
        <div style={cameraContainer}>
          <QrScanner
            onScan={(codes) => {
              if (!hasActivated.current) {
                hasActivated.current = true
                setCameraStatus('active')
              }
              if (clearTimer.current) clearTimeout(clearTimer.current)
              if (codes.length > 0) {
                const values = codes.map((c) => c.rawValue).join(', ')
                setLastDetected(values)
                setScanCount((c) => c + 1)
                // Play matching sound for each detected QR code
                for (const code of codes) {
                  if (code.rawValue in SOUND_MAP) {
                    playSound(code.rawValue)
                  }
                }
              }
              clearTimer.current = setTimeout(() => {
                setLastDetected('')
              }, 2000)
            }}
            onError={(error) => {
              console.error(error)
              if (
                error instanceof DOMException &&
                (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
              ) {
                setCameraStatus('denied')
              } else {
                setCameraStatus('error')
              }
            }}
            lastDetected={lastDetected}
            scanCount={scanCount}
          />
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
          {cameraStatus === 'active' && !audioUnlocked && contextState === 'suspended' && (
            <div
              onClick={() => {
                void resume().then(() => setAudioUnlocked(true))
              }}
              onTouchStart={() => {
                void resume().then(() => setAudioUnlocked(true))
              }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: 20,
                cursor: 'pointer',
              }}
            >
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
            </div>
          )}
        </div>
      )}

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
