'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import bs58 from 'bs58'
import { combine } from 'shamirs-secret-sharing-ts'
import { decrypt } from '../crypto'
import CloseIcon from '../CloseIcon'

export default function DecryptPage() {
  const [scans, setScans] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [password, setPassword] = useState('')
  const [permission, setPermission] = useState<PermissionState | ''>('')
  const [showResultModal, setShowResultModal] = useState(false)
  const [hasError, setHasError] = useState('')

  useEffect(() => {
    if (permission !== '') return
    navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then((result) => {
        setPermission(result.state)
      })
  }, [permission, setPermission])

  const requestAccess = useCallback(() => {
    if (permission === 'granted') return
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .catch((error) => {
        console.error('Failed to get camera access:', error)
        setErrorMsg(error.message)
      })
      .finally(() => {
        setPermission('')
      })
  }, [permission, setPermission, setErrorMsg])

  const onDecrypt = async (e: FormEvent) => {
    e.preventDefault()

    let shares: Uint8Array[]
    let recovered: Uint8Array
    let data: string

    setShowResultModal(true)

    try {
      // QR Codes
      shares = scans.map((s) => Buffer.from(bs58.decode(s)))
    } catch (e: any) {
      setHasError('QR Code: ' + e.message)
      return
    }

    try {
      // Shamir's Secret Sharing
      recovered = combine(shares!)
    } catch (e: any) {
      setHasError('SSS: ' + e.message)
      return
    }

    try {
      // AES-GCM
      const [salt, ciphertext] = recovered!.toString().split('.')
      data = await decrypt(salt, password, ciphertext)
    } catch (e: any) {
      setHasError('AES-GCM: ' + e.message)
      return
    }

    await navigator.clipboard.writeText(data!)

    setHasError('')
  }

  return (
    <>
      <form
        onSubmit={onDecrypt}
        className='flex flex-col flex-auto p-5 gap-3 h-full'
        autoComplete='off'
      >
        <div className='flex flex-col flex-none gap-2'>
          <label className='text-sm text-neutral-500 uppercase flex-none flex justify-between'>
            <span>Scan {permission}</span>
            <span>{scans.length} items scanned</span>
          </label>
          <div className='relative' onClick={() => requestAccess()}>
            <QrReader
              videoContainerStyle={{ width: '100%' }}
              videoStyle={{ width: '100%' }}
              containerStyle={{ width: '100%' }}
              className='w-full aspect-square bg-neutral-950/50 overflow-hidden rounded'
              constraints={{ facingMode: 'environment' }}
              onResult={async (result, error) => {
                if (!!result) {
                  const code = result?.getText()

                  setScans((codes) => {
                    if (codes.includes(code)) return codes
                    return [...codes, code]
                  })

                  setErrorMsg('')
                }

                if (error?.message) {
                  console.log(JSON.stringify(error))
                  setErrorMsg(error.message)
                }
              }}
            />
            {scans.length > 0 && (
              <div className='absolute inset-x-0 bottom-0 flex items-center justify-center p-3'>
                <button
                  type='button'
                  className='px-3 py-2 mt-2 text-xs uppercase rounded-md'
                  onClick={() => setScans([])}
                >
                  Tap to start over
                </button>
              </div>
            )}
            {errorMsg && (
              <div className='pointer-events-none absolute inset-x-2 bottom-2 bg-red-800/90 text-xs text-white p-3 rounded-md'>
                {errorMsg}
              </div>
            )}
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
            placeholder='Can be blank'
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
          Decrypt & copy to clipboard
        </button>
      </form>
      {showResultModal && (
        <div className='fixed inset-0 z-10 bg-black/80 flex flex-col items-center justify-center'>
          <div className='overflow-x-hidden overflow-y-auto w-full p-5'>
            <div className='flex flex-col mx-auto max-w-max'>
              <div className='p-5 gap-3 flex flex-col bg-neutral-800 rounded-md'>
                <p className='flex justify-between gap-5'>
                  <span>
                    {!hasError
                      ? 'Data saved in clipboard!'
                      : 'Something went wrong'}
                  </span>
                  <button
                    type='button'
                    onClick={() => {
                      setShowResultModal(false)
                      setHasError('')
                    }}
                  >
                    <CloseIcon />
                  </button>
                </p>
                {hasError && (
                  <p className='bg-red-800/90 text-xs text-white p-3 rounded-md'>
                    {hasError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
