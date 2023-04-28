'use client'

export default function EncryptPage() {
  return (
    <form
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
          autoFocus
          id='plaintext'
          className='bg-neutral-950/50 rounded-md w-full flex-auto h-full px-3 py-2'
        />
      </div>
      <div className='flex gap-5'>
        <div className='flex flex-col flex-auto gap-2'>
          <label
            htmlFor='password'
            className='text-sm text-neutral-500 uppercase flex-none'
          >
            Share Count
          </label>
          <input
            autoComplete='false'
            type='number'
            id='sharecount'
            className='bg-neutral-950/50 rounded-md w-full px-3 py-2'
          />
        </div>
        <div className='flex flex-col flex-auto gap-2'>
          <label
            htmlFor='password'
            className='text-sm text-neutral-500 uppercase flex-none'
          >
            Threshold
          </label>
          <input
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
