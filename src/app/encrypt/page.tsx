'use client'

import { FormEvent, useRef, useState } from 'react'
import bs58 from 'bs58'
import { split } from 'shamirs-secret-sharing-ts'
import HelpIcon from '../HelpIcon'
import { encrypt } from '../crypto'
import { QRCodeCanvas } from 'qrcode.react'
import CloseIcon from '../CloseIcon'

export default function EncryptPage() {
  const [data, setData] = useState('')
  const [numShares, setNumShares] = useState(2)
  const [threshold, setThreshold] = useState(2)
  const [password, setPassword] = useState('')
  const [qrCodes, setQrCodes] = useState<string[]>([])
  const [showResultModal, setShowResultModal] = useState(false)

  const onEncrypt = async (e: FormEvent) => {
    e.preventDefault()

    // AES-GCM
    const result = await encrypt(password, data)
    const secret = Buffer.from(result.salt + '.' + result.ciphertext)

    // Shamir's Secret Sharing
    const shares = split(secret, { shares: numShares, threshold })

    // QR Codes
    setQrCodes(shares.map((s) => bs58.encode(s)))
    setShowResultModal(true)
  }

  return (
    <>
      <form
        onSubmit={onEncrypt}
        className='flex flex-col flex-auto p-5 gap-3 h-full'
        autoComplete='off'
      >
        <div className='flex flex-col flex-auto gap-2'>
          <label
            htmlFor='plaintext'
            className='text-sm text-neutral-500 uppercase flex-none'
          >
            Plaintext data to encrypt
          </label>
          <textarea
            placeholder='Put text data to encrypt: account and passwords, private keys, seed phrases, diary, love letter, last will, etc.'
            value={data}
            onChange={(e) => setData(e.target.value)}
            autoFocus
            id='plaintext'
            className='bg-neutral-950/50 rounded-md w-full flex-auto h-full px-3 py-2'
          />
        </div>
        <div className='flex gap-5'>
          <div className='flex flex-col flex-1 gap-2'>
            <label
              htmlFor='sharecount'
              className='text-sm text-neutral-500 uppercase flex-none'
            >
              Share Count
            </label>
            <input
              min={1}
              step={1}
              value={numShares}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                setNumShares(val)
                if (val < threshold) {
                  setThreshold(val)
                }
              }}
              autoComplete='false'
              type='number'
              id='sharecount'
              className='bg-neutral-950/50 rounded-md w-full px-3 py-2'
            />
          </div>
          <div className='flex flex-col flex-1 gap-2'>
            <label
              htmlFor='threshold'
              className='text-sm text-neutral-500 uppercase flex-none flex justify-between items-center'
            >
              Threshold
              <a
                href='https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing'
                target='_blank'
                rel='noopener noreferrer'
              >
                <HelpIcon />
              </a>
            </label>
            <input
              min={1}
              max={numShares}
              step={1}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              value={threshold}
              autoComplete='false'
              type='number'
              id='threshold'
              className='bg-neutral-950/50 rounded-md w-full px-3 py-2'
            />
          </div>
        </div>
        <div className='flex flex-col flex-none gap-2'>
          <label
            htmlFor='password'
            className='text-sm text-neutral-500 uppercase flex-none'
          >
            Password
          </label>
          <input
            placeholder='Leave blank for unprotected encryption'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='false'
            type='password'
            id='password'
            className='bg-neutral-950/50 rounded-md w-full px-3 py-2'
          />
        </div>
        <button
          type='submit'
          className='bg-purple-800 hover:bg-purple-600 rounded-md px-3 py-2 mt-2'
        >
          Encrypt data
        </button>
      </form>
      {showResultModal && (
        <div className='fixed inset-0 z-10 bg-black/80 flex flex-col items-center justify-center'>
          <div className='overflow-x-hidden overflow-y-auto w-full p-5'>
            <div className='flex flex-col mx-auto max-w-max'>
              <div className='p-5 gap-3 flex flex-col bg-neutral-800 rounded-md'>
                <p className='flex justify-between'>
                  <span>Save the QR Codes individually</span>
                  <button
                    type='button'
                    onClick={() => setShowResultModal(false)}
                  >
                    <CloseIcon />
                  </button>
                </p>
                <div className='flex flex-wrap justify-center gap-5'>
                  {qrCodes.map((code, i) => (
                    <QrCodeWrapper key={`qrcode_${i}`} code={code} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function QrCodeWrapper({ code }: { code: string }) {
  return (
    <div className='flex flex-col'>
      <QRCodeCanvas size={300} includeMargin value={code} />
      <span className='text-xs'>{code}</span>
    </div>
  )
}
