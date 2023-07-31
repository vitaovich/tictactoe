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
      <div className="flex flex-col space-y-4 items-center justify-center min-h-screen bg-gray-200">
        <h1>Tic Tac Toe</h1>
        <Game />
      </div>
    </>
  )
}

const Game: React.FC = () => {
  const [history, setHistory] = useState<string[][]>([Array(9).fill('')]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [moveOrder, setMoveOrder] = useState<boolean>(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: string[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function reverseMoveOrder() {
    setMoveOrder(!moveOrder);
  }

  let moves = history.map((squares, move) => {
    let description: string;

    if (move === currentMove) {
      description = 'You are at move #' + (move);
      return (
        <li key={move}className="px-2 py-1" >
          {description}
        </li>
      );
    }
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move} className="border border-gray-500 bg-gray-200 rounded-md px-2 py-1" >
        <button  onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  moves = moveOrder ? moves : moves.reverse();

  return (
    <>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <div className="flex flex-row space-x-4 bg-white rounded-md border border-gray-500 p-4">
        <div>
          <button onClick={reverseMoveOrder} className="border border-green-500 bg-green-200 rounded-md px-2 py-1 mb-2">Sort</button>
          <ol className='space-y-2'>
            {moves}
          </ol>
        </div>
      </div>
    </>
  );
}

const Board: React.FC<{ xIsNext: boolean, squares: string[], onPlay: (nextSquares: string[]) => void }> = (props) => {
  const winner = calculateWinner(props.squares);
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
    props.onPlay(nextSquares);
  }

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (props.xIsNext ? "X" : "O");
  }

  const boardRows = [];
  for (let i = 0; i < boardSize; i++) {
    const boardRow = [];
    for (let j = 0; j < boardSize; j++) {
      let location = (i * boardSize) + j;
      boardRow.push(<Square key={location} value={props.squares[location]} onSquareClick={() => handleClick(location)} />);
    }
    boardRows.push(<div key={i} className='flex flex-row'>{boardRow}</div>);
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <h2>{status}</h2>
        {boardRows}
      </div>
    </>
  );
}

const Square: React.FC<{ value: string, onSquareClick: () => void }> = (props) => {
  return (
    <button
      className="flex items-center justify-center w-12 h-12 m-1 rounded-md border-2 border-indigo-600 bg-indigo-200"
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
