import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream">
        <h1>Tic Tac Toe</h1>
        <div className="flex items-center justify-center w-8 h-8 rounded-md border-2 border-indigo-600 bg-indigo-200">
        X
        </div>
      </div>
    </>
  )
}
