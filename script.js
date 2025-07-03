const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");

let bird, pipes, score, frame, gameStarted, gameOver;
const GRAVITY = 0.5, JUMP = -8, PIPE_WIDTH = 60, PIPE_GAP = 150, PIPE_SPEED = 2, GROUND = 60;

function init() {
  bird = {
    x: 80,
    y: 200,
    radius: 15,
    velocity: 0
  };

  pipes = [];
  score = 0;
  frame = 0;
  gameStarted = false;
  gameOver = false;
  scoreEl.textContent = "Score: 0";
  showMessage("Press SPACE or TAP to start");
}

function drawBackground() {
  ctx.fillStyle = "#8ecae6";
  ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND);
  ctx.fillStyle = "#fefae0";
  ctx.fillRect(0, canvas.height - GROUND, canvas.width, GROUND);
}

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fb8500";
  ctx.fill();
  ctx.closePath();
}

function drawPipes() {
  ctx.fillStyle = "#219ebc";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.top - PIPE_GAP - GROUND);
  }
}

function updateBird() {
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  if (bird.y + bird.radius >= canvas.height - GROUND) {
    bird.y = canvas.height - GROUND - bird.radius;
    gameOver = true;
  }

  if (bird.y - bird.radius <= 0) {
    bird.y = bird.radius;
    bird.velocity = 0;
  }
}

function spawnPipe() {
  const top = Math.floor(Math.random() * (canvas.height - PIPE_GAP - GROUND - 100)) + 50;
  pipes.push({ x: canvas.width, top, passed: false });
}

function updatePipes() {
  for (let pipe of pipes) {
    pipe.x -= PIPE_SPEED;

    if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
      pipe.passed = true;
      score++;
      scoreEl.textContent = `Score: ${score}`;
    }

    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + PIPE_WIDTH &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.top + PIPE_GAP)
    ) {
      gameOver = true;
    }
  }

  pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.style.display = "block";
}

function hideMessage() {
  messageEl.style.display = "none";
}

function flap() {
  if (!gameStarted || gameOver) {
    init();
    gameStarted = true;
    hideMessage();
  }
  bird.velocity = JUMP;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") flap();
});

canvas.addEventListener("click", () => flap());

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (gameStarted && !gameOver) {
    updateBird();
    if (frame % 90 === 0) spawnPipe();
    updatePipes();
    frame++;
  }

  drawPipes();
  drawBird();

  if (gameOver) {
    showMessage("Game Over! Press SPACE or TAP to restart");
  }

  requestAnimationFrame(gameLoop);
}

init();
gameLoop();
