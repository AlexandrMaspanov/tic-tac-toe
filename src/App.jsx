import { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick, isWinningSquare }) {
    return (
        <button
            className={`square ${isWinningSquare ? "winner" : ""}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const result = calculateWinner(squares);
    let status;
    let winningLine = [];

    if (result) {
        status = "Winner: " + result.winner;
        winningLine = result.winningLine;
    } else if (squares.every(square => square !== null)) {
        status = "Draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const boardRows = [];
    for (let row = 0; row < 3; row++) {

        const squaresInRow = [];

        for (let col = 0; col < 3; col++) {

            const index = row * 3 + col;
            const isWinningSquare = winningLine.includes(index);

            squaresInRow.push(
                <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                    isWinningSquare={isWinningSquare}
                />
            );

        }

        boardRows.push(
            <div key={row}
                className='board-row'
            >
                {squaresInRow}
            </div>
        );

    }

    return (
        <>
            <div className='status'>{status}</div>
            {boardRows}
        </>
    )
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        const isCurrentMove = move === currentMove;
        let description;

        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }

        return (
            <li key={move}>
                {isCurrentMove ? (
                    <span className='current-move'>
                        {move === 0 ? 'You are at game start' : `You are at move #${move}`}
                    </span>
                ) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>
        );
    });

    const sortedMoves = isAscending ? moves : moves.slice().reverse();

    return (
        <div className='game'>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className='game-info'>
                <button onClick={() => setIsAscending(!isAscending)}>
                    {isAscending ? "Sort Descending" : "Sort Ascending"}
                </button>
                <ol>{sortedMoves}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares) {
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
            return { winner: squares[a], winningLine: [a, b, c] };
        }
    }

    return null;
}
