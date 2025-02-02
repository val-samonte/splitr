import React, { useEffect, useRef } from 'react'
import { BrowserQRCodeReader } from '@zxing/browser'

interface QRScannerProps {
  onQRCodeScanned: (text: string) => void
  onError: (message: string) => void
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onQRCodeScanned,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReader = new BrowserQRCodeReader()

  useEffect(() => {
    const startScanning = async () => {
      try {
        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices()

        if (videoInputDevices.length === 0) {
          onError('No camera devices found')
          return
        }

        const selectedDeviceId = videoInputDevices[0].deviceId

        if (videoRef.current) {
          await codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, error) => {
              if (result) {
                onQRCodeScanned(result.getText())
              }
              if (error) {
                // Ignore errors as they occur frequently when no QR code is detected
                return
              }
            },
          )
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    startScanning()
  }, [onQRCodeScanned, onError])

  return (
    <div className='relative w-full max-w-md mx-auto'>
      <div className='aspect-video bg-black rounded-lg overflow-hidden'>
        <video ref={videoRef} className='w-full h-full object-cover' />
      </div>
      <div className='absolute inset-0 border-2 border-blue-500 opacity-50 pointer-events-none'>
        <div className='absolute inset-0 border-4 border-transparent'>
          <div className='absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500'></div>
          <div className='absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500'></div>
          <div className='absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500'></div>
          <div className='absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500'></div>
        </div>
      </div>
    </div>
  )
}
