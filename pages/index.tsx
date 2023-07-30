import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React from 'react'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

const Square: React.FC = () => {
  const [value, setValue] = useState<string>('');

  function handleClick() {
    setValue('X');
  }

  return (
    <button 
      className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200"
      onClick={handleClick}
    >
      {value}
    </button>

  );
}

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream">
        <h1>Tic Tac Toe</h1>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <Square />
            <Square />
            <Square />
          </div>
          <div className="flex flex-row">
            <Square />
            <Square />
            <Square />
          </div>
          <div className="flex flex-row">
            <Square />
            <Square />
            <Square />
          </div>
        </div>
      </div>
    </>
  )
}
