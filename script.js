const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = canvas.width; // 300px
const tileCount = canvasSize / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gamesPlayed = localStorage.getItem('gamesPlayed') || 0;
let gameInterval;

// DOM Elements
const currentScoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gamesPlayedDisplay = document.getElementById('gamesPlayed');

// Initialize stats UI
function updateStatsUI() {
  currentScoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
  gamesPlayedDisplay.textContent = gamesPlayed;
}

// Draw game components
function drawGame() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw Food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw Snake
  ctx.fillStyle = 'green';
  for (const segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  }
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check for food
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  } else {
    snake.pop();
  }

  updateStatsUI();
}

// Check for collisions
function checkCollision() {
  const head = snake[0];

  // Wall Collision
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    return true;
  }

  // Self Collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }

  return false;
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Start game
document.getElementById('startButton').addEventListener('click', () => {
  if (gameInterval) clearInterval(gameInterval); // Clear any previous game loop
  resetGame();
  gameInterval = setInterval(gameLoop, 200); // Start game loop
});

// Reset game state
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  drawGame();
  updateStatsUI();
}

// Game loop
function gameLoop() {
  if (checkCollision()) {
    clearInterval(gameInterval); // Stop game loop
    alert(`Game Over! Your score: ${score}`);
    gamesPlayed++;
    localStorage.setItem('gamesPlayed', gamesPlayed);
    updateStatsUI();
    return;
  }

  moveSnake();
  drawGame();
}

// Initial stats display
updateStatsUI();
