function App() {
  const fullScreenContainer = {
    width: '100dvw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111',
  } as const

  const cameraPlaceholder = {
    width: '80%',
    height: '60%',
    background: '#222',
    border: '2px dashed #444',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const

  const placeholderText = {
    color: '#666',
    fontSize: '1.2rem',
    userSelect: 'none' as const,
  }

  return (
    <div style={fullScreenContainer}>
      <div style={cameraPlaceholder}>
        <span style={placeholderText}>Camera will appear here</span>
      </div>
    </div>
  )
}

export default App
