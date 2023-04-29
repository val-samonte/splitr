import PhishingWarning from './PhishingWarning'
import Tabs from './Tabs'
import './globals.css'

export const metadata = {
  title: 'Splitr',
  description:
    "Data encryption tool using AES-GCM, splitting it with Shamir's secret sharing and output them as QR CodesSplit any data. Password secured.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-neutral-950 text-neutral-100'>
        <PhishingWarning />
        <main className='fixed inset-x-0 bottom-0 top-6 flex flex-col items-center justify-center'>
          <div className='overflow-x-hidden overflow-y-auto w-full p-5'>
            <div className='flex flex-col mx-auto max-w-sm'>
              <Tabs />
              <div className='flex flex-col bg-neutral-800 rounded-b-md min-h-[50vh]'>
                {children}
              </div>
            </div>
            <div className='flex flex-col gap-3 mt-3 max-w-sm mx-auto text-neutral-500 text-center'>
              <p className='uppercase text-sm'>
                <span className='font-bold '>Disclaimer</span>
              </p>
              <p className='uppercase text-xs'>
                By using this tool (website), you agree that the developer is
                not responsible for any loss or damages that may occur to you.
                Use at your own risk!
              </p>
              <p className='flex gap-5 underline mx-auto text-sm'>
                <a
                  href='https://twitter.com/vasamonte/status/1652254981859446787'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Twitter
                </a>
                <a
                  href='https://github.com/val-samonte/splitr'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </a>
              </p>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
