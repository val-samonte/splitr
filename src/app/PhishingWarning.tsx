'use client'

import { useState } from 'react'

export default function PhishingWarning() {
  const [showModal, setShowModal] = useState(true)
  return (
    <>
      <div
        className='bg-yellow-400 text-black h-6 font-bold w-full uppercase text-center cursor-pointer'
        onClick={() => setShowModal(true)}
      >
        Be careful of <span className='underline'>phishing attack</span>
      </div>
      {showModal && (
        <div className='fixed inset-0 z-10 bg-black/80 flex flex-col items-center justify-center'>
          <div className='overflow-x-hidden overflow-y-auto w-full p-5'>
            <div className='flex flex-col mx-auto max-w-sm'>
              <div className='p-5 gap-3 flex flex-col bg-neutral-800 rounded-md min-h-[50vh] text-sm'>
                <p>
                  You will always encounter scams and bad actors. The best thing
                  that you can do is to conduct your own research and remain
                  vigilant.
                </p>
                <p>
                  As an extra precaution, before entering any sensitive
                  information into this site, please follow these steps:
                </p>
                <ol className='list-disc pl-5 flex-col flex gap-2'>
                  <li>Go incognito / private browsing.</li>
                  <li>
                    Check the URL to ensure you have visited the correct
                    website.
                  </li>
                  <li>
                    Load the page that you intend to use (
                    <span className='font-bold text-purple-400'>/encrypt</span>{' '}
                    or{' '}
                    <span className='font-bold text-purple-400'>/decrypt</span>
                    ).
                  </li>
                  <li>
                    Disconnect your internet access; this website
                    <br />
                    <span className='font-bold text-purple-400'>
                      SHOULD NOT
                    </span>{' '}
                    call any external HTTP requests nor store any local data in
                    your browser.
                  </li>
                  <li>
                    Close the website when you are finished. It is better to
                    exit the entire private browsing session.
                  </li>
                </ol>
                <p className='text-center uppercase'>
                  <span className='font-bold text-purple-400'>Disclaimer</span>
                </p>
                <p className='text-center uppercase'>
                  BY USING THIS TOOL (WEBSITE), YOU AGREE THAT THE DEVELOPER IS
                  NOT RESPONSIBLE FOR ANY LOSS OR DAMAGES THAT MAY OCCUR TO YOU.
                  USE AT YOUR OWN RISK!
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  type='button'
                  className='bg-purple-800 hover:bg-purple-600 rounded-md px-3 py-2 mt-2 text-base'
                >
                  I have read everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
