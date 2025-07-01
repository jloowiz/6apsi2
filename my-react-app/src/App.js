import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

const chickenImg = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg';
const bananaImg = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg';

function App() {
  const [player, setPlayer] = useState(null);
  const [character, setCharacter] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(6).fill(null)));
  const [winner, setWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    socket.on('assignPlayer', ({ player }) => setPlayer(player));
    socket.on('gameStart', ({ player1Choice, player2Choice }) => {
      setGameStarted(true);
      setCurrentPlayer('player1');
    });
    socket.on('updateBoard', setBoard);
    socket.on('gameOver', ({ winner }) => setWinner(winner));
    socket.on('resetBoard', () => {
      setBoard(Array(6).fill().map(() => Array(6).fill(null)));
      setWinner(null);
      setGameStarted(false);
      setCharacter(null);
    });

    return () => socket.off();
  }, []);

  const chooseCharacter = (choice) => {
    setCharacter(choice);
    socket.emit('chooseCharacter', choice);
  };

  const handleClick = (row, col) => {
    if (!gameStarted || board[row][col] || winner || player !== currentPlayer) return;
    socket.emit('playerMove', { player, row, col });
  };

  const renderCell = (row, col) => {
    const value = board[row][col];
    let img = null;
    if (value === 'player1') img = chickenImg;
    if (value === 'player2') img = bananaImg;
    return (
      <div className="tile" key={`${row}-${col}`} onClick={() => handleClick(row, col)}>
        {img && <img src={img} alt="icon" className="icon" />}
      </div>
    );
  };

  return (
    <div className="game-container">
      {!gameStarted && !character ? (
        <div className="character-select">
          <h2>Select your character</h2>
          <button onClick={() => chooseCharacter('chicken')}>Chicken</button>
          <button onClick={() => chooseCharacter('banana')}>Banana</button>
        </div>
      ) : (
        <>
          <h1>{winner ? `${winner === 'player1' ? 'Chicken' : 'Banana'} Wins!` : `Current Turn: ${currentPlayer === 'player1' ? 'Chicken' : 'Banana'}`}</h1>
          <div className="grid">
            {board.map((row, rowIndex) => (
              <div className="row" key={rowIndex}>
                {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;