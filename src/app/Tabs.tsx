'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Tabs() {
  const path = usePathname()

  return (
    <div className='flex'>
      <Link
        href='/encrypt'
        className={classNames(
          'flex-auto appearance-none rounded-t-xl px-5 py-3 text-center',
          path.includes('/encrypt')
            ? 'bg-neutral-800 text-white'
            : 'bg-neutral-900/50 text-neutral-400',
        )}
      >
        Encrypt
      </Link>
      <Link
        href='/decrypt'
        className={classNames(
          'flex-auto appearance-none rounded-t-xl px-5 py-3 text-center',
          path.includes('/decrypt')
            ? 'bg-neutral-800 text-white'
            : 'bg-neutral-900/50 text-neutral-400',
        )}
      >
        Decrypt
      </Link>
    </div>
  )
}
