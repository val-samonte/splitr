import PhishingWarning from './PhishingWarning'
import Tabs from './Tabs'
import './globals.css'

export const metadata = {
  title: 'AES-SSS-QRCODE',
  description: 'Split any data. Password secured.',
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
            <div className='flex flex-col gap-3 mt-3 max-w-xs mx-auto text-neutral-500'>
              <p className='text-center uppercase text-sm'>
                <span className='font-bold '>Disclaimer</span>
              </p>
              <p className='text-center uppercase text-xs'>
                By using this tool (website), you agree that the developer is
                not responsible for any loss or damages that may happen to you
              </p>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
