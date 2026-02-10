import { useRef, memo } from 'react'
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner'

interface QrScannerProps {
  onScanRef: React.RefObject<((codes: IDetectedBarcode[]) => void) | null>
  onErrorRef: React.RefObject<((error: unknown) => void) | null>
}

// Fully static component — never re-renders after mount
export default memo(function QrScanner({ onScanRef, onErrorRef }: QrScannerProps) {
  // Stable callbacks that delegate to refs
  const stableScan = useRef((codes: IDetectedBarcode[]) => {
    onScanRef.current?.(codes)
  }).current

  const stableError = useRef((error: unknown) => {
    onErrorRef.current?.(error)
  }).current

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Scanner
        formats={['qr_code']}
        constraints={{ facingMode: 'environment' }}
        scanDelay={500}
        allowMultiple
        onScan={stableScan}
        onError={stableError}
        components={{ finder: false }}
        styles={{
          container: { width: '100%', height: '100%' },
          video: { objectFit: 'cover' },
        }}
        sound={false}
      />
      {/* Scan area outline */}
      <div
        style={{
          position: 'absolute',
          inset: '5%',
          border: '2px solid rgba(255, 60, 60, 0.6)',
          borderRadius: '12px',
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: '32%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.85rem',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        Make sure all QR codes are within this view
      </span>
    </div>
  )
}, () => true) // Never re-render — props are refs, always stable
