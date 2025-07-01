const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameState = {
  player1: null,
  player2: null,
  player1Choice: null,
  player2Choice: null,
  currentPlayer: null,
  board: Array(6).fill().map(() => Array(6).fill(null)),  // 6x6 grid
  winner: null,
};

app.use(express.static('build'));  // Serve the React app

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Listen for player connections
io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  // Assign player and allow them to choose a character
  if (!gameState.player1) {
    gameState.player1 = socket.id;
    socket.emit('assignPlayer', { player: 'player1' });
  } else if (!gameState.player2) {
    gameState.player2 = socket.id;
    socket.emit('assignPlayer', { player: 'player2' });
  }

  // Handle player choosing a character
  socket.on('chooseCharacter', (choice) => {
    if (gameState.player1 === socket.id) {
      gameState.player1Choice = choice;
    } else if (gameState.player2 === socket.id) {
      gameState.player2Choice = choice;
    }

    // Start the game once both players have chosen
    if (gameState.player1Choice && gameState.player2Choice) {
      gameState.currentPlayer = 'player1';  // Player 1 starts
      io.emit('gameStart', {
        player1Choice: gameState.player1Choice,
        player2Choice: gameState.player2Choice,
      });
    }
  });

  // Handle player clicks
  socket.on('playerMove', (data) => {
    const { player, row, col } = data;

    if (gameState.winner) return;

    // Check if it's the correct player's turn
    if (player === gameState.currentPlayer) {
      gameState.board[row][col] = player;
      // Check for winner or next turn
      if (checkWinner(player, row, col)) {
        gameState.winner = player;
        io.emit('gameOver', { winner: player });
      } else {
        gameState.currentPlayer = player === 'player1' ? 'player2' : 'player1';
        io.emit('updateBoard', gameState.board);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
    if (socket.id === gameState.player1) gameState.player1 = null;
    if (socket.id === gameState.player2) gameState.player2 = null;
    io.emit('resetBoard');
  });
});

// Check if a player has won
function checkWinner(player, row, col) {
  const directions = [
    { r: 1, c: 0 },  // vertical
    { r: 0, c: 1 },  // horizontal
    { r: 1, c: 1 },  // diagonal down-right
    { r: -1, c: 1 }, // diagonal up-right
  ];

  for (let direction of directions) {
    let count = 1;

    // Check one direction
    let r = row + direction.r;
    let c = col + direction.c;
    while (r >= 0 && r < 6 && c >= 0 && c < 6 && gameState.board[r][c] === player) {
      count++;
      r += direction.r;
      c += direction.c;
    }

    // Check the opposite direction
    r = row - direction.r;
    c = col - direction.c;
    while (r >= 0 && r < 6 && c >= 0 && c < 6 && gameState.board[r][c] === player) {
      count++;
      r -= direction.r;
      c -= direction.c;
    }

    // If count >= 4, we have a winner
    if (count >= 4) return true;
  }
  return false;
}

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
