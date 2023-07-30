import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React from 'react'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cream">
        <Game />
      </div>
    </>
  )
}

const Game: React.FC = () => {
  const [history, setHistory] = useState<string[][]>([Array(9).fill('')]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: string[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove:number)
  {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description: string;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <div className="border-2">
        <ol>
          {moves}
        </ol>
      </div>
    </>
  );
}

const Board: React.FC<{xIsNext:boolean, squares:string[], onPlay:(nextSquares:string[]) => void}> = (props) => {
  const winner = calculateWinner(props.squares);
  let status:string;

  function handleClick(i: number) {
    if(props.squares[i] !== '' || calculateWinner(props.squares)) return;

    const nextSquares = props.squares.slice();
    if(props.xIsNext)
    {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    props.onPlay(nextSquares);
  }

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (props.xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <Square value={props.squares[0]} onSquareClick={() => handleClick(0)}/>
          <Square value={props.squares[1]} onSquareClick={() => handleClick(1)}/>
          <Square value={props.squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className="flex flex-row">
          <Square value={props.squares[3]} onSquareClick={() => handleClick(3)}/>
          <Square value={props.squares[4]} onSquareClick={() => handleClick(4)}/>
          <Square value={props.squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className="flex flex-row">
          <Square value={props.squares[6]} onSquareClick={() => handleClick(6)}/>
          <Square value={props.squares[7]} onSquareClick={() => handleClick(7)}/>
          <Square value={props.squares[8]} onSquareClick={() => handleClick(8)}/>
        </div>
      </div>
      <h2>{status}</h2>
    </>
  );
}

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

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
