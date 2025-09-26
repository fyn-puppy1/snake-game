const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

const gridSize = 14;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 10};
let dx = 1, dy = 0;
let changingDirection = false;
let score = 0;
let gameOver = false;
let paused = false;
let speed = 120; // ms per frame
let timeoutId = null;

// Draw functions as before...
function drawSnake() {
    snake.forEach((segment, idx) => {
        ctx.save();
        ctx.beginPath();
        if (idx === 0) {
            ctx.shadowColor = "#fff44f";
            ctx.shadowBlur = 18;
            ctx.fillStyle = "#fff44f";
        } else {
            ctx.shadowColor = "#7fffd4";
            ctx.shadowBlur = 8;
            ctx.fillStyle = "#5afc7b";
        }
        ctx.arc(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize / 2.1,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.restore();
    });
}

function drawFood() {
    ctx.save();
    ctx.shadowColor = "#ff8a65";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.fillStyle = "#f96b4c";
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2.3,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.restore();
}

function drawScore() {
    ctx.font = "22px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 18, 32);
    ctx.textAlign = "start";
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        placeFood();
        if (score % 5 === 0 && speed > 50) speed -= 10;
    } else {
        snake.pop();
    }
}

function placeFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    food = newFood;
}

function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount
    ) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function drawGameOver() {
    ctx.font = "46px Arial";
    ctx.fillStyle = "#ff5d7a";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2-18);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Press Space to Restart", canvas.width/2, canvas.height/2+26);
    ctx.textAlign = "start";
}

function drawPaused() {
    ctx.font = "44px Arial";
    ctx.fillStyle = "#ffd700";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
    ctx.textAlign = "start";
}

function clearCanvas() {
    ctx.fillStyle = "#202938";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    if (paused) {
        clearCanvas();
        drawScore();
        drawFood();
        drawSnake();
        drawPaused();
        return;
    }
    if (gameOver) {
        drawGameOver();
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawScore();
    moveSnake();
    if (checkCollision()) {
        gameOver = true;
        drawGameOver();
        return;
    }
    drawFood();
    drawSnake();
    timeoutId = setTimeout(gameLoop, speed);
}

// Controls: Keyboard
document.addEventListener("keydown", (e) => {
    if (changingDirection) return;
    changingDirection = true;
    if ((e.key === "ArrowLeft" || e.key === "a") && dx !== 1) {
        dx = -1; dy = 0;
    } else if ((e.key === "ArrowUp" || e.key === "w") && dy !== 1) {
        dx = 0; dy = -1;
    } else if ((e.key === "ArrowRight" || e.key === "d") && dx !== -1) {
        dx = 1; dy = 0;
    } else if ((e.key === "ArrowDown" || e.key === "s") && dy !== -1) {
        dx = 0; dy = 1;
    }
    // Spacebar: Pause/Resume or Restart
    if (e.key === " ") {
        if (gameOver) {
            restartGame();
        } else {
            togglePause();
        }
    }
});

// Controls: Buttons
function setupButtonControls() {
    const upBtn = document.getElementById("upBtn");
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");
    const downBtn = document.getElementById("downBtn");
    const pauseBtn = document.getElementById("pauseBtn");

    upBtn.addEventListener("click", () => { if (dy !== 1) { dx = 0; dy = -1; } });
    leftBtn.addEventListener("click", () => { if (dx !== 1) { dx = -1; dy = 0; } });
    rightBtn.addEventListener("click", () => { if (dx !== -1) { dx = 1; dy = 0; } });
    downBtn.addEventListener("click", () => { if (dy !== -1) { dx = 0; dy = 1; } });

    pauseBtn.addEventListener("click", () => {
        if (gameOver) return;
        togglePause();
    });
}

function togglePause() {
    paused = !paused;
    const pauseBtn = document.getElementById("pauseBtn");
    if (paused) {
        pauseBtn.innerText = "▶ Resume";
        if (timeoutId) clearTimeout(timeoutId);
        gameLoop();
    } else {
        pauseBtn.innerText = "⏸ Pause";
        gameLoop();
    }
}

function restartGame() {
    snake = [{x: 10, y: 10}];
    dx = 1; dy = 0;
    score = 0;
    gameOver = false;
    paused = false;
    speed = 120;
    const pauseBtn = document.getElementById("pauseBtn");
    pauseBtn.innerText = "⏸ Pause";
    placeFood();
    gameLoop();
}

// Initial setup
setupButtonControls();
placeFood();
gameLoop();
