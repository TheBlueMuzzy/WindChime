import { useRef, useState } from 'react'
import QrScanner from './components/QrScanner'

type CameraStatus = 'loading' | 'active' | 'denied' | 'error'

function App() {
  const [lastDetected, setLastDetected] = useState('')
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading')
  const hasActivated = useRef(false)

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
              if (codes.length > 0) {
                const values = codes.map((c) => c.rawValue).join(', ')
                setLastDetected(values)
                console.log(codes)
              }
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
