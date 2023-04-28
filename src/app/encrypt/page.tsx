'use client'

import { FormEvent, useState } from 'react'
import HelpIcon from '../HelpIcon'

export default function EncryptPage() {
  const [data, setData] = useState('')
  const [numShares, setNumShares] = useState(2)
  const [threshold, setThreshold] = useState(2)
  const [password, setPassword] = useState('')

  const onEncrypt = (e: FormEvent) => {
    e.preventDefault()

    // PBKDF2

    // DERIVE KEY

    // AES ECRYPTION

    // SHAMIR'S SECRET

    // QR CODES
  }

  return (
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
  )
}
