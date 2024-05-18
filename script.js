const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// General settings
let gamePlaying = false;
let flyHeight;
let currentScore;
let pipeX;
let pipeGapY;

// Bird settings
const birdWidth = 34;
const birdHeight = 24;
const birdY = canvas.height / 2 - birdHeight / 2;
const gravity = 0.5;
let birdYVelocity = 0;

// Pipe settings
const pipeWidth = 52;
const pipeHeight = 320;
const pipeGap = 140;

// Event listeners for both click and touch to start the game
document.addEventListener('click', () => {
  if (!gamePlaying) {
    startGame();
  }
});
canvas.addEventListener('touchstart', () => {
  if (!gamePlaying) {
    startGame();
  }
});

// Function to start the game
function startGame() {
  gamePlaying = true;
  flyHeight = canvas.height / 2;
  currentScore = 0;
  birdYVelocity = 0;
  pipeX = canvas.width;
  pipeGapY = Math.random() * (canvas.height - pipeGap);
  requestAnimationFrame(render);
}

// Main game loop
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (gamePlaying) {
    // Update bird position
    birdYVelocity += gravity;
    flyHeight += birdYVelocity;

    // Draw bird
    ctx.drawImage(img, 0, 0, birdWidth, birdHeight, 80, flyHeight, birdWidth, birdHeight);

    // Draw pipes
    pipeX -= 2;
    ctx.drawImage(img, 56, 323, pipeWidth, pipeHeight, pipeX, 0, pipeWidth, pipeHeight);
    ctx.drawImage(img, 0, 323, pipeWidth, pipeHeight, pipeX, pipeGapY + pipeGap, pipeWidth, pipeHeight);

    // Check collision
    if (pipeX < 116 && pipeX + pipeWidth > 80 && (flyHeight < pipeGapY || flyHeight + birdHeight > pipeGapY + pipeGap)) {
      endGame();
    }

    // Score update
    if (pipeX + pipeWidth < 80) {
      currentScore++;
      pipeX = canvas.width;
      pipeGapY = Math.random() * (canvas.height - pipeGap);
    }

    // Request next frame
    requestAnimationFrame(render);
  }
}

// End the game
function endGame() {
  gamePlaying = false;
  // Handle game over logic here
}
