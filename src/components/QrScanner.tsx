import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner'

interface QrScannerProps {
  onScan: (detectedCodes: IDetectedBarcode[]) => void
  onError?: (error: unknown) => void
  lastDetected?: string
}

export default function QrScanner({ onScan, onError, lastDetected }: QrScannerProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Scanner
        formats={['qr_code']}
        constraints={{ facingMode: 'environment' }}
        scanDelay={500}
        onScan={onScan}
        onError={onError}
        components={{ finder: false }}
        styles={{
          container: { width: '100%', height: '100%' },
          video: { objectFit: 'cover' },
        }}
        sound={false}
      />
      {/* Large scan area outline — shows user where to aim all QR codes */}
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
          bottom: '12px',
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
      {/* Temporary: show detected code on screen (replaced in 02-03) */}
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
          }}
        >
          Detected: {lastDetected}
        </span>
      )}
    </div>
  )
}
