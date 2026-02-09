import { useState } from 'react'
import QrScanner from './components/QrScanner'

function App() {
  const [lastDetected, setLastDetected] = useState('')

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

  return (
    <div style={fullScreenContainer}>
      <div style={cameraContainer}>
        <QrScanner
          onScan={(codes) => {
            if (codes.length > 0) {
              const values = codes.map((c) => c.rawValue).join(', ')
              setLastDetected(values)
              console.log(codes)
            }
          }}
          onError={(error) => console.error(error)}
          lastDetected={lastDetected}
        />
      </div>
    </div>
  )
}

export default App
