const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bird = { x: 80, y: canvas.height / 2, width: 34, height: 24 };
const gravity = 0.5;
let birdVelocity = 0;
let pipeX = canvas.width;
let pipeGapY = Math.random() * (canvas.height - 140);

document.addEventListener('click', () => {
  birdVelocity = -9; // Adjusted jump power
});

function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Update bird position
  birdVelocity += gravity;
  bird.y += birdVelocity;

  // Draw pipe
  ctx.fillRect(pipeX, 0, 52, pipeGapY);
  ctx.fillRect(pipeX, pipeGapY + 140, 52, canvas.height - (pipeGapY + 140));

  // Move pipe
  pipeX -= 2;

  // Check collision
  if (bird.y > canvas.height || bird.y < 0 || (bird.x + bird.width > pipeX && bird.x < pipeX + 52 && (bird.y < pipeGapY || bird.y + bird.height > pipeGapY + 140))) {
    alert('Game Over');
    location.reload();
  } else if (pipeX + 52 < bird.x) {
    // Score update
    document.getElementById('score').innerText++;
    // Reset pipe position
    pipeX = canvas.width;
    pipeGapY = Math.random() * (canvas.height - 140);
  }

  requestAnimationFrame(render);
}

render();
