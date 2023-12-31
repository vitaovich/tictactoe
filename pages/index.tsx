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
      <Game />
    </>
  )
}

const Game: React.FC = () => {
  const [history, setHistory] = useState<string[][]>([Array(9).fill('')]);
  const [playHistory, setPlayHistory] = useState<number[]>([]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [moveOrder, setMoveOrder] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const xIsNext = currentMove % 2 === 0;
  const isGameOver = history.length > 9;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: string[], playLocation: number) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextPlayHistory = [...playHistory.slice(0, currentMove + 1), playLocation];
    setHistory(nextHistory);
    setPlayHistory(nextPlayHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function reverseMoveOrder() {
    setMoveOrder(!moveOrder);
  }

  function toggleHistory() {
    setShowHistory(!showHistory);
  }

  let moves = history.map((squares, move) => {
    let description: string;

    if (move === currentMove) {
      description = 'You are at move #' + (move) + `${currentMove > 0 ? calculateRowCol(playHistory[move - 1]) : ''}`;
      return (
        <li key={move} className="bg-gray-400 text-white rounded-md px-2 py-1" >
          <div className="">
            {description}
          </div>
        </li>
      );
    }
    if (move > 0) {
      description = 'Go to move #' + move + ` ${calculateRowCol(playHistory[move - 1])}`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move} className="border bg-gray-700 text-white rounded-md px-2 py-1 hover:bg-gray-600" >
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  moves = moveOrder ? moves : moves.reverse();
  const displayHistoryClass = showHistory ? '' : 'hidden';

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-10">
        <h1 className='text-3xl text-indigo-800'>Tic Tac Toe</h1>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} isGameOver={isGameOver} />
        <div className="flex flex-row space-x-4">
          <button onClick={toggleHistory} className='rounded-md bg-gray-400 text-white uppercase px-2 py-1 hover:bg-gray-500'>History</button>
          <button onClick={() => jumpTo(0)} className='rounded-md bg-green-500 text-white uppercase px-2 py-1 hover:bg-green-400'>Reset</button>
        </div>
      </div>

      <div className={`${displayHistoryClass} absolute left-0 top-0`}>
        <div className="bg-gray-200 p-4 min-h-screen">
          <div>
            <div className="flex flex-row justify-between">
              <button onClick={reverseMoveOrder} className="bg-gray-400 text-white rounded-md px-2 py-1 mb-2 hover:bg-gray-500">Sort</button>
              <button onClick={toggleHistory} className="px-2 py-1 mb-2 rounded-md w-8 h-8 bg-red-500 text-white">X</button>
            </div>
            <ol className='space-y-2'>
              {moves}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

const Board: React.FC<{ xIsNext: boolean, squares: string[], onPlay: (nextSquares: string[], playLocation: number) => void, isGameOver: boolean }> = (props) => {
  const winnerSquares = calculateWinner(props.squares);
  const boardSize = 3;
  let status: string;

  function handleClick(i: number) {
    if (props.squares[i] !== '' || calculateWinner(props.squares)) return;

    const nextSquares = props.squares.slice();
    if (props.xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    props.onPlay(nextSquares, i);
  }

  if (winnerSquares) {
    const winner = props.squares[winnerSquares[0]]
    status = "Winner: " + winner;
  }
  else if (props.isGameOver) {
    status = "Draw"
  }
  else {
    status = "Next player: " + (props.xIsNext ? "X" : "O");
  }

  const boardRows = [];
  for (let i = 0; i < boardSize; i++) {
    const boardRow = [];
    for (let j = 0; j < boardSize; j++) {
      let location = (i * boardSize) + j;
      const isWinner = winnerSquares?.includes(location);
      boardRow.push(<Square key={location} value={props.squares[location]} onSquareClick={() => handleClick(location)} isWinner={isWinner} />);
    }
    boardRows.push(<div key={i} className='flex flex-row'>{boardRow}</div>);
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className='text-lg text-indigo-700 mb-2'>{status}</h2>
        {boardRows}
      </div>
    </>
  );
}

const Square: React.FC<{ value: string, onSquareClick: () => void, isWinner: boolean | undefined }> = (props) => {
  const buttonClasses = props.isWinner ? 'border-green-600 bg-green-200 text-green-700' : 'border-indigo-600 bg-indigo-200 text-indigo-700';
  const selectableClass = props.value === '' ? 'hover:animate-pulse hover:bg-indigo-400' : '';
  return (
    <button
      className={`flex items-center justify-center w-24 h-24 text-7xl m-1 border-2 ${selectableClass} ${buttonClasses}`}
      onClick={props.onSquareClick}
    >
      {props.value}
    </button>

  );
}

function calculateRowCol(location: number) {
  const rowCols = [
    '(1,1)',
    '(1,2)',
    '(1,3)',
    '(2,1)',
    '(2,2)',
    '(2,3)',
    '(3,1)',
    '(3,2)',
    '(3,3)',
  ]
  return rowCols[location];
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
      return lines[i];
    }
  }
  return null;
}
