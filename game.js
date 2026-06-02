const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreText = document.querySelector("#score");
const livesText = document.querySelector("#lives");
const speedText = document.querySelector("#speed");
const leftButton = document.querySelector("#leftButton");
const rightButton = document.querySelector("#rightButton");

const baseBallSpeed = 2;
const maxBallSpeed = 8;

const keys = {
  left: false,
  right: false,
};

const paddle = {
  x: canvas.width / 2 - 70,
  y: canvas.height - 45,
  width: 140,
  height: 16,
  speed: 8,
};

const ball = {
  x: canvas.width / 2,
  y: 80,
  radius: 13,
  speedX: 2,
  speedY: 2,
};

let score = 0;
let lives = 3;
let gameOver = false;

function resetBall() {
  const speed = getBallSpeed();

  ball.x = canvas.width / 2;
  ball.y = 80;
  ball.speedX = Math.random() < 0.5 ? -speed : speed;
  ball.speedY = speed;
}

function getBallSpeed() {
  return Math.min(maxBallSpeed, baseBallSpeed + score * 0.35);
}

function restartGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  paddle.x = canvas.width / 2 - paddle.width / 2;
  resetBall();
  updateHud();
}

function updateHud() {
  scoreText.textContent = score;
  livesText.textContent = lives;
  speedText.textContent = getBallSpeed().toFixed(1);
}

function movePaddle() {
  if (keys.left) {
    paddle.x -= paddle.speed;
  }

  if (keys.right) {
    paddle.x += paddle.speed;
  }

  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
}

function moveBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.speedX *= -1;
  }

  if (ball.y - ball.radius <= 0) {
    ball.speedY *= -1;
  }

  const hitsPaddle =
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.speedY > 0;

  if (hitsPaddle) {
    const paddleCenter = paddle.x + paddle.width / 2;
    const hitPosition = (ball.x - paddleCenter) / (paddle.width / 2);

    score += 1;
    const speed = getBallSpeed();
    ball.speedX = hitPosition * speed * 1.6;
    ball.speedY = -speed;
    updateHud();
  }

  if (ball.y - ball.radius > canvas.height) {
    lives -= 1;
    updateHud();

    if (lives <= 0) {
      gameOver = true;
      return;
    }

    resetBall();
  }
}

function drawBackground() {
  ctx.fillStyle = "#172033";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#263449";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 70);
  ctx.lineTo(canvas.width, 70);
  ctx.stroke();
}

function drawBall() {
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddle() {
  ctx.fillStyle = "#facc15";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawText() {
  ctx.fillStyle = "#eef4ff";
  ctx.font = "20px Arial";
  ctx.fillText("Fang den Ball!", 24, 42);

  if (gameOver) {
    ctx.fillStyle = "rgba(16, 22, 36, 0.78)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f87171";
    ctx.font = "42px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "#eef4ff";
    ctx.font = "22px Arial";
    ctx.fillText("Druecke Leertaste", canvas.width / 2, canvas.height / 2 + 25);
    ctx.textAlign = "left";
  }
}

function gameLoop() {
  if (!gameOver) {
    movePaddle();
    moveBall();
  }

  drawBackground();
  drawBall();
  drawPaddle();
  drawText();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    event.preventDefault();
    keys.left = true;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    event.preventDefault();
    keys.right = true;
  }

  if (event.code === "Space" && gameOver) {
    event.preventDefault();
    restartGame();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = false;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = false;
  }
});

function holdButton(button, direction) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    keys[direction] = true;
  });

  button.addEventListener("pointerup", () => {
    keys[direction] = false;
  });

  button.addEventListener("pointerleave", () => {
    keys[direction] = false;
  });

  button.addEventListener("pointercancel", () => {
    keys[direction] = false;
  });
}

holdButton(leftButton, "left");
holdButton(rightButton, "right");

updateHud();
gameLoop();
