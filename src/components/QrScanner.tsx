import { useRef, memo } from 'react'
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner'

/** Custom tracker: draws green rounded-rect highlights on detected QR codes */
const customTracker = (detectedCodes: IDetectedBarcode[], ctx: CanvasRenderingContext2D) => {
  for (const code of detectedCodes) {
    const { x, y, width, height } = code.boundingBox
    const radius = 8

    // Semi-transparent green fill
    ctx.fillStyle = 'rgba(0, 255, 100, 0.15)'
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.7)'
    ctx.lineWidth = 3

    ctx.beginPath()
    // roundRect with fallback for older browsers
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius)
    } else {
      ctx.rect(x, y, width, height)
    }
    ctx.fill()
    ctx.stroke()

    // Draw rawValue text centered below the box
    if (code.rawValue) {
      ctx.font = '12px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 3
      ctx.fillText(code.rawValue, x + width / 2, y + height + 6)
      ctx.shadowBlur = 0
    }
  }
}

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

  // Stable ref to tracker — same strategy as onScan/onError
  const stableTracker = useRef(customTracker).current

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Scanner
        formats={['qr_code']}
        constraints={{ facingMode: 'environment' }}
        scanDelay={500}
        allowMultiple
        onScan={stableScan}
        onError={stableError}
        components={{ finder: false, tracker: stableTracker }}
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
