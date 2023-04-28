'use client'

import { useCallback, useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'

export default function DecryptPage() {
  const [scans, setScans] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [permissionState, setPermissionState] = useState('') // useState('')

  useEffect(() => {
    if (permissionState !== '') return
    navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then((result) => {
        console.log(result)
        setPermissionState(result.state)
      })
  }, [permissionState, setPermissionState])

  const requestAccess = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .catch((error) => {
        console.error('Failed to get camera access:', error)
        setErrorMsg(JSON.stringify(error))
      })
      .finally(() => {
        setPermissionState('')
      })
  }, [setPermissionState, setErrorMsg])

  return (
    <form
      className='flex flex-col flex-auto p-5 gap-3 h-full'
      autoComplete='off'
    >
      <div className='flex flex-col flex-none gap-2'>
        <label className='text-sm text-neutral-500 uppercase flex-none flex justify-between'>
          <span>Scan {permissionState}</span>
          <span>{scans.length} items scanned</span>
        </label>
        <div className='relative' onClick={() => requestAccess()}>
          <QrReader
            videoContainerStyle={{ width: '100%' }}
            videoStyle={{ width: '100%' }}
            containerStyle={{ width: '100%' }}
            className='w-full aspect-square bg-black/20 overflow-hidden rounded'
            constraints={{ facingMode: 'environment' }}
            onResult={async (result, error) => {
              if (!!result) {
                const code = result?.getText()
                setScans((codes) => [...codes, code])
              }

              if (error?.message) {
                console.log(JSON.stringify(error))
                // setErrorMsg(error.message)
                setErrorMsg(error.message)
              }
            }}
          />
          {errorMsg && (
            <div className='absolute inset-x-2 bottom-2 bg-red-800/10 text-xs text-red-600 p-3 rounded'>
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
        Decrypt to Clipboard
      </button>
    </form>
  )
}
