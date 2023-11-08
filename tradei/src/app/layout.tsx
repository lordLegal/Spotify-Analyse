import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from "./components/navbar/nav"
import Link from 'next/link'
import {FaSpotify} from 'react-icons/fa'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trade Spotify',
  description: 'Analyse and Trade with Coins using your Spotify Data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><Nav></Nav><div className='pt-20'>{children}</div><footer className="flex items-center justify-center w-full h-24 border-t">
          Coded and Designed by <Link href="https://github.com/lordLegal" className="text-green-600"> Martin Beneder</Link><br></br>
          <Link href="https://spotify.com/"><FaSpotify className="fill-green-500" ></FaSpotify></Link>
        </footer></body>
    </html>
  )
}
