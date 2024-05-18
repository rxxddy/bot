document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const birdImage = new Image();
  birdImage.src = 'assets/plane.png';

  const obstacleImage = new Image();
  obstacleImage.src = 'assets/mount.png';

  const bird = {
      x: 50,
      y: 150,
      width: 40, // Adjust to match your image dimensions
      height: 30, // Adjust to match your image dimensions
      gravity: 0.7,
      lift: -10,
      velocity: 0
  };

  const obstacles = [];
  const obstacleWidth = 100; // Adjust to make mountains wider
  const obstacleGap = 150;
  let frameCount = 0;
  let score = 0;
  let bestScore = localStorage.getItem('bestScore') || 0;
  let isRunning = false;
  let gameStarted = false;

  function drawBird() {
      ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  }

  function updateBird() {
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.height > canvas.height || bird.y < 0) {
          isRunning = false;
      }
  }

  function createObstacle() {
      const height = Math.random() * (canvas.height - obstacleGap - 50) + 50;
      obstacles.push({
          x: canvas.width,
          topHeight: height,
          bottomHeight: canvas.height - height - obstacleGap
      });
  }

  function drawObstacles() {
      obstacles.forEach(obstacle => {
          // Draw the top mountain (flipped)
          ctx.save();
          ctx.translate(obstacle.x + obstacleWidth / 2, obstacle.topHeight / 2);
          ctx.scale(1, -1);
          ctx.drawImage(obstacleImage, -obstacleWidth / 2, -obstacle.topHeight / 2, obstacleWidth, obstacle.topHeight);
          ctx.restore();

          // Draw the bottom mountain
          ctx.drawImage(obstacleImage, obstacle.x, canvas.height - obstacle.bottomHeight, obstacleWidth, obstacle.bottomHeight);
      });
  }

  function updateObstacles() {
      obstacles.forEach(obstacle => {
          obstacle.x -= 2;

          if (obstacle.x + obstacleWidth < 0) {
              obstacles.shift();
              score++;
              if (score > bestScore) {
                  bestScore = score;
                  localStorage.setItem('bestScore', bestScore);
              }
          }

          // Check collision with top mountain (approximated with bounding boxes)
          if (bird.x < obstacle.x + obstacleWidth && bird.x + bird.width > obstacle.x) {
              if (bird.y < obstacle.topHeight * 0.75 || bird.y + bird.height > canvas.height - obstacle.bottomHeight * 0.75) {
                  isRunning = false;
              }
          }
      });

      if (frameCount % 90 === 0) {
          createObstacle();
      }
  }

  function resetGame() {
      bird.y = 150;
      bird.velocity = 0;
      obstacles.length = 0;
      score = 0;
      frameCount = 0;
      isRunning = true;
      gameStarted = true;
  }

  function drawScore() {
      document.getElementById('currentScore').innerText = `Score: ${score}`;
      document.getElementById('bestScore').innerText = `Best: ${bestScore}`;
  }

  function drawStartScreen() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tap to Start', canvas.width / 2, canvas.height / 2);
  }

  function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isRunning) {
          updateBird();
          updateObstacles();
          drawBird();
          drawObstacles();
          drawScore();
          frameCount++;
      } else if (!gameStarted) {
          drawStartScreen();
      } else {
          drawStartScreen();
      }

      requestAnimationFrame(gameLoop);
  }

  document.addEventListener('click', function() {
      if (!gameStarted) {
          resetGame();
      } else if (isRunning) {
          bird.velocity = bird.lift;
      } else {
          resetGame();
      }
  });

  gameLoop();
});
