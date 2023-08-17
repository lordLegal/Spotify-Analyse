import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from "./components/navbar/nav"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Analyse',
  description: 'Analyse your Spotify Data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><Nav></Nav><div className='pt-20'>{children}</div></body>
    </html>
  )
}
