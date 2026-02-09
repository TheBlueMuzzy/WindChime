import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner'

interface QrScannerProps {
  onScan: (detectedCodes: IDetectedBarcode[]) => void
  onError?: (error: unknown) => void
}

export default function QrScanner({ onScan, onError }: QrScannerProps) {
  return (
    <Scanner
      formats={['qr_code']}
      constraints={{ facingMode: 'environment' }}
      scanDelay={500}
      onScan={onScan}
      onError={onError}
      styles={{
        container: { width: '100%', height: '100%' },
        video: { objectFit: 'cover' },
      }}
      sound={false}
    />
  )
}
