const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 24;
const speed = 250;
const scoreP = document.getElementById('score');

let snake;
let direction;
let food;
let score;
let game;
let Newhead;

function start() {
  direction = 'RIGHT';
  snake = [{x: 5 * box, y: 5 * box}];
  food = {
    x: Math.floor(Math.random() * 10) * box,
    y: Math.floor(Math.random() * 10) * box
  };  
  score = 0;
  game = setInterval(drawGame, speed);
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function drawGame() {
  // Resart frame
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(food.x, food.y, box, box);
  
  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'rgb(0, 125, 210)' : 'rgb(0, 120, 200)';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'UP') headY -= box;
  if (direction === 'DOWN') headY += box;
  
  newHead = {x: headX, y: headY};

  // Check if snake eats food
  if (headX === food.x && headY === food.y) {
    score++;
    while (
      snake.some(segment => segment.x === food.x && segment.y === food.y) ||
      newHead.x === food.x && newhead.y === food.y
    ) {
      food = {
        x: Math.floor(Math.random() * 10) * box,
        y: Math.floor(Math.random() * 10) * box
      };
    }
  } else {
    snake.pop();
  }

  // Check collision
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    clearInterval(game);
  }

  // Creates new head
  snake.unshift(newHead);

  // Sets score
  scoreP.textContent = 'Score: ' + score;
}

start();

const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', function() {
  start();
});
