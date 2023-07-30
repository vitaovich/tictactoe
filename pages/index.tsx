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
        <div className="flex flex-col">
          <div className="flex flex-row">
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">1</button>
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">2</button>
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">3</button>
          </div>
          <div className="flex flex-row">
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">4</button>
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">5</button>
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">6</button>
          </div>
          <div className="flex flex-row">
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">7</button>
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">8</button>
            <button className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200">9</button>
          </div>
        </div>
      </div>
    </>
  )
}
