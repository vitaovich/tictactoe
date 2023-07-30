import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React from 'react'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

const Square: React.FC<{ value: string, onSquareClick: () => void }> = (props) => {
  return (
    <button 
      className="flex items-center justify-center w-8 h-8 m-2 rounded-md border-2 border-indigo-600 bg-indigo-200"
      onClick={props.onSquareClick}
    >
      {props.value}
    </button>

  );
}

const Board: React.FC = () => {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(''));

  function handleClick(i: number) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="flex flex-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="flex flex-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream">
        <h1>Tic Tac Toe</h1>
        <Board />
      </div>
    </>
  )
}
