import QrScanner from './components/QrScanner'

function App() {
  const fullScreenContainer = {
    width: '100dvw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111',
  } as const

  const cameraContainer = {
    width: '95%',
    height: '85%',
    borderRadius: '8px',
    overflow: 'hidden',
  } as const

  return (
    <div style={fullScreenContainer}>
      <div style={cameraContainer}>
        <QrScanner
          onScan={(codes) => console.log(codes)}
          onError={(error) => console.error(error)}
        />
      </div>
    </div>
  )
}

export default App
