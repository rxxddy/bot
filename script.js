// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// General settings
const GRAVITY = 0.7;
const BIRD_SIZE = [51, 36];
const JUMP = -12;
const CANVAS_TENTH = (canvas.width / 10);
const PIPE_WIDTH = 78;
const PIPE_GAP = 220;
const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const SPEED = 4;

let gamePlaying = false;
let index = 0;
let bestScore = 0;
let flight, flyHeight, currentScore, pipes;

const pipeLoc = () => Math.random() * ((canvas.height - (PIPE_GAP + PIPE_WIDTH)) - PIPE_WIDTH) + PIPE_WIDTH;

const setup = () => {
  currentScore = 0;
  flight = JUMP;
  flyHeight = (canvas.height / 2) - (BIRD_SIZE[1] / 2);
  pipes = Array(3).fill().map((_, i) => [canvas.width + (i * (PIPE_GAP + PIPE_WIDTH)), pipeLoc()]);
}

const getBirdAngle = (flight) => {
  const UP_ANGLE = 30 * Math.PI / 180;
  const DOWN_ANGLE = 100 * Math.PI / 180;

  return flight < 0 ? Math.max(-UP_ANGLE, flight / 15) : Math.min(DOWN_ANGLE, flight / 20);
}

const offCanvas = document.createElement('canvas');
offCanvas.width = canvas.width;
offCanvas.height = canvas.height;
const offCtx = offCanvas.getContext('2d');

const renderBackground = () => {
  const backgroundX = -((index * (SPEED / 2)) % canvas.width);
  offCtx.drawImage(img, 0, 0, canvas.width, canvas.height, backgroundX + canvas.width, 0, canvas.width, canvas.height);
  offCtx.drawImage(img, 0, 0, canvas.width, canvas.height, backgroundX, 0, canvas.width, canvas.height);
}

const render = () => {
  index++;
  renderBackground();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offCanvas, 0, 0);

  if (gamePlaying) {
    pipes.forEach(pipe => {
      pipe[0] -= SPEED;

      ctx.drawImage(img, 432, 588 - pipe[1], PIPE_WIDTH, pipe[1], pipe[0], 0, PIPE_WIDTH, pipe[1]);
      ctx.drawImage(img, 432 + PIPE_WIDTH, 108, PIPE_WIDTH, canvas.height - pipe[1] + PIPE_GAP, pipe[0], pipe[1] + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe[1] + PIPE_GAP);

      if (pipe[0] <= -PIPE_WIDTH) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes.push([pipes[pipes.length - 1][0] + PIPE_GAP + PIPE_WIDTH, pipeLoc()]);
        pipes.shift();
      }

      const birdHitPipe = pipe[0] <= CANVAS_TENTH + BIRD_SIZE[0] &&
                          pipe[0] + PIPE_WIDTH >= CANVAS_TENTH &&
                          (pipe[1] > flyHeight || pipe[1] + PIPE_GAP < flyHeight + BIRD_SIZE[1]);
      if (birdHitPipe) {
        gamePlaying = false;
        setup();
      }
    });

    ctx.save();
    ctx.translate(CANVAS_TENTH + BIRD_SIZE[0] / 2, flyHeight + BIRD_SIZE[1] / 2);
    ctx.rotate(getBirdAngle(flight));
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * BIRD_SIZE[1], ...BIRD_SIZE, -BIRD_SIZE[0] / 2, -BIRD_SIZE[1] / 2, ...BIRD_SIZE);
    ctx.restore();

    flight += GRAVITY;
    flyHeight = Math.min(flyHeight + flight, canvas.height - BIRD_SIZE[1]);

    if (flyHeight >= canvas.height - BIRD_SIZE[1]) {
      gamePlaying = false;
      setup();
    }
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * BIRD_SIZE[1], ...BIRD_SIZE, (canvas.width / 2) - (BIRD_SIZE[0] / 2), flyHeight, ...BIRD_SIZE);
  }

  window.requestAnimationFrame(render);
}

const startGame = () => {
  if (!gamePlaying) {
    gamePlaying = true;
    flight = JUMP;
  }
};

document.addEventListener('click', startGame);
canvas.addEventListener('touchstart', startGame);

window.onclick = () => flight = JUMP;
canvas.addEventListener('touchstart', () => flight = JUMP);

const updateScore = () => {
  document.getElementById('bestScore').textContent = `Best: ${bestScore}`;
  document.getElementById('currentScore').textContent = `Current: ${currentScore}`;
}

setup();
img.onload = render;
setInterval(updateScore, 100);
