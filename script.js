// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Game settings
const GRAVITY = 0.5;
const BIRD_SIZE = [51, 36];
const JUMP = -8;
const PIPE_WIDTH = 78;
const PIPE_GAP = 200;
const SPEED = 4;

let gamePlaying = false;
let flight, flyHeight, pipes, currentScore, bestScore = 0;
let index = 0;

// Initialize game settings
const setup = () => {
    currentScore = 0;
    flight = JUMP;
    flyHeight = (canvas.height / 2) - (BIRD_SIZE[1] / 2);
    pipes = Array(3).fill().map((_, i) => [canvas.width + (i * (PIPE_GAP + PIPE_WIDTH)), pipeLoc()]);
}

// Random pipe location
const pipeLoc = () => Math.random() * ((canvas.height - (PIPE_GAP + PIPE_WIDTH)) - PIPE_WIDTH) + PIPE_WIDTH;

const render = () => {
    index++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    if (gamePlaying) {
        pipes.forEach(pipe => {
            pipe[0] -= SPEED;

            // Top pipe
            ctx.drawImage(img, 432, 588 - pipe[1], PIPE_WIDTH, pipe[1], pipe[0], 0, PIPE_WIDTH, pipe[1]);
            // Bottom pipe
            ctx.drawImage(img, 432 + PIPE_WIDTH, 108, PIPE_WIDTH, canvas.height - pipe[1] + PIPE_GAP, pipe[0], pipe[1] + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe[1] + PIPE_GAP);

            if (pipe[0] <= -PIPE_WIDTH) {
                currentScore++;
                bestScore = Math.max(bestScore, currentScore);
                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + PIPE_GAP + PIPE_WIDTH, pipeLoc()]];
            }

            // Collision detection
            const birdHitPipe = pipe[0] <= cTenth + BIRD_SIZE[0] &&
                                pipe[0] + PIPE_WIDTH >= cTenth &&
                                (pipe[1] > flyHeight || pipe[1] + PIPE_GAP < flyHeight + BIRD_SIZE[1]);
            if (birdHitPipe) {
                gamePlaying = false;
                setup();
            }
        });
        
        // Draw bird
        ctx.save();
        ctx.translate(cTenth + BIRD_SIZE[0] / 2, flyHeight + BIRD_SIZE[1] / 2);
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
        // Bird at rest
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

const cTenth = (canvas.width / 10);

const getBirdAngle = (flight) => {
    const UP_ANGLE = 30 * Math.PI / 180;
    const DOWN_ANGLE = 100 * Math.PI / 180;

    return flight < 0 ? Math.max(-UP_ANGLE, flight / 15) : Math.min(DOWN_ANGLE, flight / 20);
}
