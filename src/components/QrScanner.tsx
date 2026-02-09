import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner'

interface QrScannerProps {
  onScan: (detectedCodes: IDetectedBarcode[]) => void
  onError?: (error: unknown) => void
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
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
    </div>
  )
}
