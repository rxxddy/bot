// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// General settings
let gamePlaying = false;
let gravity = 1; // Adjusted gravity
const size = [51, 36];
const jump = -12;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0,
    flight,
    flyHeight,
    currentScore,
    pipes;

// Pipe settings
const pipeWidth = 78;
const pipeGap = 220;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

// Detect if the user is on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const speed = isMobile ? 10 : 4; // Increased speed on mobile

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = (canvas.height / 2) - (size[1] / 2);
  pipes = Array(3).fill().map((_, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const getBirdAngle = (flight) => {
  const upAngle = 30 * Math.PI / 180;  // 30 degrees in radians
  const downAngle = 100 * Math.PI / 180; // 100 degrees in radians

  if (flight < 0) {
    return Math.max(-upAngle, flight / 10); // Adjusted flight angle for smoother rotation
  } else {
    return Math.min(downAngle, flight / 20);
  }
}

// Offscreen canvas for background
const offCanvas = document.createElement('canvas');
offCanvas.width = canvas.width;
offCanvas.height = canvas.height;
const offCtx = offCanvas.getContext('2d');

const renderBackground = () => {
  offCtx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  offCtx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
}

const render = () => {
  index++;

  // Draw background from offscreen canvas
  renderBackground();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas once before drawing
  ctx.drawImage(offCanvas, 0, 0);

  if (gamePlaying) {
    pipes.forEach(pipe => {
      pipe[0] -= speed;

      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }

      if ([
        pipe[0] <= cTenth + size[0],
        pipe[0] + pipeWidth >= cTenth,
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(Boolean)) {
        gamePlaying = false;
        setup();
      }
    });

    ctx.save();
    ctx.translate(cTenth + size[0] / 2, flyHeight + size[1] / 2);
    ctx.rotate(getBirdAngle(flight));
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, -size[0] / 2, -size[1] / 2, ...size);
    ctx.restore();

    flight += gravity; // Apply gravity
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

    if (flyHeight >= canvas.height - size[1]) {
      gamePlaying = false;
      setup();
    }
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
  }

  window.requestAnimationFrame(render);
}

setup();
img.onload = render;

const startGame = () => {
  if (!gamePlaying) {
    gamePlaying = true;
    flight = jump;
  }
};

document.addEventListener('click', startGame);
canvas.addEventListener('touchstart', startGame); // Changed back to 'touchstart'

// Jump on click or touch
window.onclick = () => flight = jump;
canvas.addEventListener('touchstart', () => flight = jump); // Changed back to 'touchstart'

// Update score using HTML/CSS instead of canvas
const updateScore = () => {
  document.getElementById('bestScore').textContent = `Best: ${bestScore}`;
  document.getElementById('currentScore').textContent = `Current: ${currentScore}`;
}

// Update scores regularly to reflect changes
setInterval(updateScore, 100);
