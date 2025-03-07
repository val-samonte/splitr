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
  const codeReader = useRef(new BrowserQRCodeReader())

  useEffect(() => {
    const startScanning = async () => {
      try {
        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices()

        if (videoInputDevices.length === 0) {
          onError('No camera devices found. Tap to retry.')
          return
        }

        // Select the back camera if available, otherwise default to the first device
        const selectedDevice =
          videoInputDevices.find(
            (device) =>
              device.label.toLowerCase().includes('back') ||
              device.label.toLowerCase().includes('rear'),
          ) || videoInputDevices[0]

        const selectedDeviceId = selectedDevice.deviceId

        if (videoRef.current) {
          await codeReader.current.decodeFromVideoDevice(
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
