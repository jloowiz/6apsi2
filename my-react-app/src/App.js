import React, { useState } from 'react';
import './App.css';

const chickenImg = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg';
const bananaImg = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg';

// Helper to generate a randomized board of "chicken" and "banana"
function generateRandomBoard() {
  const flat = Array(36)
    .fill(null)
    .map(() => (Math.random() < 0.5 ? 'chicken' : 'banana'));
  const board = [];
  for (let i = 0; i < 6; i++) {
    board.push(flat.slice(i * 6, i * 6 + 6));
  }
  return board;
}

function App() {
  const [phase, setPhase] = useState('start');
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(6).fill(null)));
  const [randomized, setRandomized] = useState(null); // stores the randomized chicken/banana board
  const [selectedTile, setSelectedTile] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [revealed, setRevealed] = useState(false); // new state for reveal/conceal

  const handleStart = () => {
    const rand = generateRandomBoard();
    setRandomized(rand);
    setBoard(Array(6).fill().map(() => Array(6).fill(null)));
    setPhase('playing');
    setSelectedTile(null);
    setConfirmation(false);
    setRevealed(false);
  };

  const handleClick = (row, col) => {
    if (phase !== 'playing' || confirmation || revealed) return;
    setSelectedTile({ row, col });
    setConfirmation(true);
  };

  // Reveal all tiles, chosen tile glows
  const handleConfirm = () => {
    if (!selectedTile) return;
    const { row, col } = selectedTile;
    const newBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? 'chosen' : 'opened'))
    );
    setBoard(newBoard);
    setConfirmation(false);
    setPhase('ended');
    setRevealed(false);
  };

  // Reveal all tiles (no glowing)
  const handleReveal = () => {
    if (!revealed) {
      const newBoard = board.map((r, rIdx) =>
        r.map((cell, cIdx) => (cell === 'chosen' ? 'chosen' : 'opened'))
      );
      setBoard(newBoard);
      setRevealed(true);
    } else {
      // Conceal all tiles (except chosen if ended)
      const newBoard = board.map((r, rIdx) =>
        r.map((cell, cIdx) =>
          (phase === 'ended' && cell === 'chosen') ? 'chosen' : null
        )
      );
      setBoard(newBoard);
      setRevealed(false);
    }
  };

  // Randomize the chicken/banana board, reset all tiles
  const handleRandomize = () => {
    const rand = generateRandomBoard();
    setRandomized(rand);
    setBoard(Array(6).fill().map(() => Array(6).fill(null)));
    setSelectedTile(null);
    setConfirmation(false);
    setPhase('playing');
    setRevealed(false);
  };

  // Exit to start screen
  const handleExit = () => {
    setBoard(Array(6).fill().map(() => Array(6).fill(null)));
    setRandomized(null);
    setPhase('start');
    setSelectedTile(null);
    setConfirmation(false);
    setRevealed(false);
  };

  const handleCancel = () => {
    setConfirmation(false);
    setSelectedTile(null);
  };

  const renderCell = (row, col) => {
    const value = board[row][col];
    const isChosen = value === 'chosen';
    const tileNumber = row * 6 + col + 1;
    const animal = randomized ? randomized[row][col] : null;
    return (
      <div
        className={
          'tile' +
          (isChosen ? ' chosen-tile' : '') +
          (value === 'opened' ? ' opened-tile' : '') +
          (!value && phase === 'playing' ? '' : ' revealed-tile')
        }
        key={`${row}-${col}`}
        onClick={() => (phase === 'playing' && !confirmation && !revealed ? handleClick(row, col) : undefined)}
        style={{ pointerEvents: phase === 'playing' && !confirmation && !revealed && !value ? 'auto' : 'none' }}
      >
        <span className="tile-number center-number">{tileNumber}</span>
        {(value === 'opened' || value === 'chosen') && (
          <img
            src={animal === 'chicken' ? chickenImg : bananaImg}
            alt={animal}
          />
        )}
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

      {(phase === 'playing' || phase === 'ended') && (
        <>
          <h1>Chicken Banana Game</h1>
          <div className="grid">
            {board.map((row, rIdx) => (
              <div key={rIdx} className="row">
                {row.map((_, cIdx) => renderCell(rIdx, cIdx))}
              </div>
            ))}
          </div>

          <div style={{ margin: '20px 0' }}>
            <button className="pixel-button play-button" onClick={handleReveal}>
              {revealed ? 'Conceal All' : 'Reveal All'}
            </button>
            <button className="pixel-button play-button" onClick={handleRandomize}>Randomize</button>
            <button className="pixel-button restart-button" onClick={handleExit}>Exit</button>
          </div>

          {confirmation && selectedTile && (
            <div className="confirmation-modal">
              <div className="confirmation-content">
                <p>
                  Confirm opening tile #{selectedTile.row * 6 + selectedTile.col + 1}?
                </p>
                <button className="pixel-button play-button" onClick={handleConfirm}>Confirm</button>
                <button className="pixel-button restart-button" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          )}

          {phase === 'ended' && selectedTile && (
            <div className="message" style={{ marginTop: 20 }}>
              Game Over! Tile #{selectedTile.row * 6 + selectedTile.col + 1} was chosen.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;