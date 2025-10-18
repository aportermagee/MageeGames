const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function start() {
  const box = 24;
  const speed = 100;
  let snake = [{x: 5 * box, y: 5 * box}];
  let direction = 'RIGHT';
  let food = {
    x: Math.floor(Math.random() * 10) * box,
    y: Math.floor(Math.random() * 10) * box
  };
  let score = 0;
  const game = setInterval(drawGame, 100);
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
};

function drawGame() {
  // Resart frame
  ctx.fillStyle = 'rgb(200, 115, 60)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'rgb(0, 125, 0)' : 'rgb(0, 175, 0)';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'UP') headY -= box;
  if (direction === 'DOWN') headY += box;

  // Check if snake eats food
  if (headX === food.x && headY === food.y) {
    score++;
    let food = {
      x: Math.floor(Math.random() * 10) * box,
      y: Math.floor(Math.random() * 10) * box
    };
  } else {
    snake.pop();
  }

  // Check collision
  newHead = {x: headX, y: headY};
  
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    clearInterval(game);
  }

  // Creates new head
  snake.unshift(newHead);
}

start();

const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', function() {
  start();
});
