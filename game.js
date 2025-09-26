const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

// Game constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 10};
let dx = 1, dy = 0;
let changingDirection = false;
let score = 0;
let gameOver = false;
let speed = 120; // ms per frame

function drawSnake() {
    ctx.fillStyle = "#5afc7b";
    snake.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? "#fff44f" : "#5afc7b";
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#f96b4c";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
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

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        placeFood();
        // Increase speed every 5 points
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
        // Don't place food on the snake
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    food = newFood;
}

function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount
    ) return true;
    // Self collision
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

function clearCanvas() {
    ctx.fillStyle = "#202938";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
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
    setTimeout(gameLoop, speed);
}

// Controls
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
    if (e.key === " " && gameOver) {
        // Restart
        snake = [{x: 10, y: 10}];
        dx = 1; dy = 0;
        score = 0;
        gameOver = false;
        speed = 120;
        placeFood();
        gameLoop();
    }
});

placeFood();
gameLoop();
