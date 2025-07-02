import React, { useState } from 'react';
import './App.css';

const chickenImg = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg';
const bananaImg = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg';

function App() {
  const [phase, setPhase] = useState('start');
  const [character, setCharacter] = useState(null);
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(6).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  const handleStart = () => setPhase('select');

  const handleCharacterSelect = (char) => {
    setCharacter(char);
    setPhase('playing');
  };

  const handleClick = (row, col) => {
    if (board[row][col] || winner || phase !== 'playing') return;

    const newBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? currentPlayer : cell))
    );

    const flat = newBoard.flat();
    const count1 = flat.filter(cell => cell === 'player1').length;
    const count2 = flat.filter(cell => cell === 'player2').length;

    setScore({ player1: count1, player2: count2 });
    setBoard(newBoard);

    if (count1 >= 10) setWinner('player1');
    else if (count2 >= 10) setWinner('player2');
    else setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  const restartGame = () => {
    setBoard(Array(6).fill().map(() => Array(6).fill(null)));
    setWinner(null);
    setPhase('start');
    setCharacter(null);
    setCurrentPlayer('player1');
    setScore({ player1: 0, player2: 0 });
  };

  const renderCell = (row, col) => {
    const value = board[row][col];
    let img = null;
    if (value === 'player1') img = character === 'chicken' ? chickenImg : bananaImg;
    if (value === 'player2') img = character === 'chicken' ? bananaImg : chickenImg;
    return (
      <div className="tile" key={`${row}-${col}`} onClick={() => handleClick(row, col)}>
        {img && <img src={img} alt="icon" />}
      </div>
    );
  };

  return (
    <div className="game-container">
      {phase === 'start' && (
        <div className="start-screen">
          <h1>CHICKEN BANANA MINESWEEPER</h1>
          <button className="pixel-button play-button" onClick={handleStart}>Play Game</button>
        </div>
      )}

      {phase === 'select' && (
        <div className="character-select">
          <h2>Select Your Character</h2>
          <div className="choice-buttons">
            <button className="pixel-button chicken-btn" onClick={() => handleCharacterSelect('chicken')}>Chicken</button>
            <button className="pixel-button banana-btn" onClick={() => handleCharacterSelect('banana')}>Banana</button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <>
          <h1>
            {winner
              ? `${winner === 'player1' ? character : character === 'chicken' ? 'Banana' : 'Chicken'} Wins!`
              : `Turn: ${currentPlayer === 'player1' ? character : character === 'chicken' ? 'Banana' : 'Chicken'}`}
          </h1>

          <div className="score-box">
            <div className="score player1-score animate-score">{character} Score: {score.player1}</div>
            <div className="score player2-score animate-score">{character === 'chicken' ? 'Banana' : 'Chicken'} Score: {score.player2}</div>
          </div>

          <div className="grid">
            {board.map((row, rIdx) => (
              <div key={rIdx} className="row">
                {row.map((_, cIdx) => renderCell(rIdx, cIdx))}
              </div>
            ))}
          </div>

          {winner && (
            <button className="pixel-button restart-button" onClick={restartGame}>Restart</button>
          )}
        </>
      )}
    </div>
  );
}

export default App;