const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Off-screen canvases for pre-rendering
const backgroundCanvas = document.createElement('canvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = canvas.width * 2;
backgroundCanvas.height = canvas.height;

const birdCanvas = document.createElement('canvas');
const birdCtx = birdCanvas.getContext('2d');
birdCanvas.width = size[0];
birdCanvas.height = size[1];

const pipeCanvas = document.createElement('canvas');
const pipeCtx = pipeCanvas.getContext('2d');
pipeCanvas.width = pipeWidth * 2;
pipeCanvas.height = canvas.height;

// General settings
let gamePlaying = false;
const gravity = 0.5;
const speed = 4;
const size = [51, 36];
const jump = -10;
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

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = (canvas.height / 2) - (size[1] / 2);
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const getBirdAngle = (flight) => {
  const upAngle = 30 * Math.PI / 180;
  const downAngle = 100 * Math.PI / 180;

  if (flight < 0) {
    return Math.max(-upAngle, flight / 10);
  } else {
    return Math.min(downAngle, flight / 20);
  }
}

// Pre-render background
const renderBackground = () => {
  backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  backgroundCtx.drawImage(img, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

// Pre-render bird
const renderBird = () => {
  birdCtx.clearRect(0, 0, birdCanvas.width, birdCanvas.height);
  birdCtx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, 0, 0, ...size);
}

// Pre-render pipe
const renderPipe = () => {
  pipeCtx.clearRect(0, 0, pipeCanvas.width, pipeCanvas.height);
  pipeCtx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height, 0, 0, pipeWidth, canvas.height);
  pipeCtx.drawImage(img, 432, 588, pipeWidth, pipeWidth, 0, 0, pipeWidth, pipeWidth);
}

const render = () => {
  index++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderBackground();
  renderPipe();

  if (gamePlaying) {
    pipes.forEach(pipe => {
      pipe[0] -= speed;

      ctx.drawImage(pipeCanvas, pipe[0], 0);

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes.push([pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]);
        pipes.shift();
      }

      if (pipe[0] <= cTenth + size[0] && pipe[0] + pipeWidth >= cTenth && (pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1])) {
        gamePlaying = false;
        setup();
      }
    });

    renderBird();
    ctx.save();
    ctx.translate(cTenth, flyHeight);
    ctx.rotate(getBirdAngle(flight));
    ctx.drawImage(birdCanvas, -size[0] / 2, -size[1] / 2);
    ctx.restore();

    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);

    if (flyHeight >= canvas.height - size[1]) {
      gamePlaying = false;
      setup();
    }
  } else {
    ctx.drawImage(birdCanvas, (canvas.width - size[0]) / 2, flyHeight);
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click or Tap to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  window.requestAnimationFrame(render);
}

setup();
img.onload = () => {
  renderBackground();
  renderBird();
  renderPipe();
  render();
};

// Event listeners for both click and touch
document.addEventListener('click', () => {
  if (!gamePlaying) {
    gamePlaying = true;
  }
});
canvas.addEventListener('touchstart', () => {
  if (!gamePlaying) {
    gamePlaying = true;
  }
});

// Jump on click or touch
window.onclick = () => flight = jump;
canvas.addEventListener('touchstart', () => flight = jump);
