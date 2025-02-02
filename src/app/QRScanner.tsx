import React, { useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'

interface QRScannerProps {
  onQRCodeScanned: (text: string) => void
  onError: (message: string) => void
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onQRCodeScanned,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)

  useEffect(() => {
    const startScanning = async () => {
      try {
        const cameras = await QrScanner.listCameras()

        if (cameras.length === 0) {
          onError('No camera devices found. Tap to retry.')
          return
        }

        // Select the back camera if available, otherwise default to the first camera
        const selectedCamera =
          cameras.find(
            (camera) =>
              camera.label.toLowerCase().includes('back') ||
              camera.label.toLowerCase().includes('rear'),
          ) || cameras[0]

        if (!videoRef.current) return

        // Stop any existing scanner
        if (scannerRef.current) {
          scannerRef.current.destroy()
        }

        // Create new scanner
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            onQRCodeScanned(result.data)
          },
          {
            preferredCamera: selectedCamera.id,
            highlightScanRegion: false,
            highlightCodeOutline: false,
            returnDetailedScanResult: true,
          },
        )

        await scannerRef.current.start()
      } catch (error) {
        console.error('Error accessing camera:', error)
        onError(
          'Failed to access camera. Please ensure camera permissions are granted.',
        )
      }
    }

    startScanning()

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy()
      }
    }
  }, [onQRCodeScanned, onError])

  return (
    <div className='relative w-full max-w-md mx-auto'>
      <div className='aspect-square bg-black rounded-lg overflow-hidden'>
        <video ref={videoRef} className='w-full h-full object-cover' />
      </div>
      <div className='absolute inset-0 opacity-50 pointer-events-none'>
        <div className='absolute inset-0 border-4 border-transparent'>
          <div className='absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-md'></div>
          <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-md'></div>
          <div className='absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-md'></div>
          <div className='absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-md'></div>
        </div>
      </div>
    </div>
  )
}
