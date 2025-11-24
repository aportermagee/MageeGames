// --- Snake Game Implementation ---
(function() {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const gridSize = 16;
  let snake, direction, food, score, gameOver, moveQueue, snakeInterval;

  window.resetSnake = function() {
    snake = [{x:8, y:8}];
    direction = {x: 0, y: -1};
    moveQueue = [];
    placeFood();
    score = 0;
    gameOver = false;
    updateSnakeScore();
    clearInterval(snakeInterval);
    snakeInterval = setInterval(gameLoop, 100);
    drawSnake();
  }

  function updateSnakeScore() {
    document.getElementById('snake-score').textContent = 'Score: ' + score;
  }

  function placeFood() {
    while (true) {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      if (!snake.some(s => s.x === food.x && s.y === food.y)) break;
    }
  }

  function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "#1a8";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? "#fff" : "#eee";
      ctx.fillRect(snake[i].x * 20, snake[i].y * 20, 20, 20);
    }

    // Draw borders
    ctx.strokeStyle = "#555";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
      ctx.fillStyle = "#e55353";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    }
  }

  function gameLoop() {
    if (gameOver) return;

    // Move direction from queue, if any
    if (moveQueue.length) {
      const nextDir = moveQueue.shift();
      // Prevent reverse direction
      if ((nextDir.x !== -direction.x || nextDir.y !== -direction.y)) {
        direction = nextDir;
      }
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      gameOver = true;
      clearInterval(snakeInterval);
      drawSnake();
      return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameOver = true;
      clearInterval(snakeInterval);
      drawSnake();
      return;
    }

    snake.unshift(head); // add new head

    // Check food
    if (head.x === food.x && head.y === food.y) {
      score++;
      updateSnakeScore();
      placeFood();
    } else {
      snake.pop(); // remove tail
    }

    drawSnake();
  }

  document.addEventListener('keydown', e => {
    let move;
    if (e.key === 'ArrowUp') move = {x:0, y:-1};
    if (e.key === 'ArrowDown') move = {x:0, y:1};
    if (e.key === 'ArrowLeft') move = {x:-1, y:0};
    if (e.key === 'ArrowRight') move = {x:1, y:0};
    if (move) moveQueue.push(move);
  });

  // Initialize game
  window.resetSnake();
})();
