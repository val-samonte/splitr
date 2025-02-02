import React, { useState, useRef, DragEvent, ReactNode } from 'react'
import QrScanner from 'qr-scanner'

interface QRDragDropProps {
  children: ReactNode
  onQRCodesDetected: (qrCodes: (string | null)[]) => void
  className?: string
}

const QRDragDrop: React.FC<QRDragDropProps> = ({
  children,
  onQRCodesDetected,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: FileList) => {
    const qrCodes: (string | null)[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.includes('png')) continue

      try {
        const result = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        })
        qrCodes.push(result.data)
      } catch (error) {
        console.error('Error processing file:', error)
        qrCodes.push(null)
      }
    }

    onQRCodesDetected(qrCodes)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    await processFiles(files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files
    if (files) {
      await processFiles(files)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-lg cursor-pointer border-2 border-transparent duration-200 ${
        isDragging ? 'border-dashed border-white/80 bg-gray-800/50' : ''
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type='file'
        accept='.png'
        multiple
        onChange={handleFileInputChange}
        className='hidden'
      />

      {isDragging && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <p className='text-white text-lg'>Drop PNG files here</p>
        </div>
      )}

      {children}
    </div>
  )
}

export default QRDragDrop
