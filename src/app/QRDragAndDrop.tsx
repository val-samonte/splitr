import React, { useState, useRef, DragEvent, ReactNode } from 'react'
import { BrowserQRCodeReader } from '@zxing/browser'

interface QRDragDropProps {
  children: ReactNode
  onQRCodesDetected: (qrCodes: (string | null)[]) => void
  className?: string
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const createCanvas = (img: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  context?.drawImage(img, 0, 0)
  return canvas
}

const QRDragDrop: React.FC<QRDragDropProps> = ({
  children,
  onQRCodesDetected,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const reader = new BrowserQRCodeReader()

  const processFiles = async (files: FileList) => {
    const qrCodes: (string | null)[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.includes('png')) continue

      try {
        const imageUrl = URL.createObjectURL(file)
        const img = await loadImage(imageUrl)
        const canvas = createCanvas(img)
        const result = await reader.decodeFromCanvas(canvas)

        qrCodes.push(result.getText())
        URL.revokeObjectURL(imageUrl)
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
      className={`relative cursor-pointer transition-all duration-200 ${
        isDragging ? 'border-2 border-dashed border-white bg-gray-800/50' : ''
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
