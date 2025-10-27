// --- Return User To Login Page ---
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}


// --- Initialize Supabase ---
const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// --- Set Up ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 12;
const smallBox = 4;
const speed = 20;
const gameSpeed = 500 / speed;
const scoreP = document.getElementById('score');

const playerY = canvas.height / box - 4;


// ----- High Score -----
let highScore;

// Get High Score
async function getHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .select('highScoreSpaceInvaders')
    .eq('id', JSON.parse(localStorage.getItem('user')).id)
    .single();

  if (error) {
    console.error(error);
  } else {
    highScore = data.highScoreSpaceInvaders;
  }
}

// Change Score
getHighScore().then(function() {
  scoreP.textContent = 'Score: 0 | High Score: ' + highScore;
});

// Update High Score
async function updateHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .update({ highScoreSpaceInvaders: highScore })
    .eq('id', JSON.parse(localStorage.getItem('user')).id);

  if (error) {
    console.error(error);
  }
}


// --- In-Game Variables ---
let health;
let playerX;
let enemyY;
let enemyX;
let enemies;
let round;
let enemyBullets;
let game;
let score;
let playerShotTimer;
let gameTimer;
let playerBullets;
let enemyDirection;
let endGame;
let wall;


// ----- Start Of Game -----
function start() {
  
  // --- Player ---
  playerX = canvas.width / box / 2;
  health = 3;
  playerBullets = [];
  playerShotTimer = gameSpeed;

  
  // --- Enemy ---
  enemyY = 1;
  enemyX = 0;
  enemyBullets = [];
  enemyDirection = 'right';

  enemies = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  ];

  
  // Miscellaneous
  score = 0;
  round = 0;
  gameTimer = gameSpeed - round * 25;
  endGame = false;
  wall = false;

  // Game Loop
  game = setInterval(drawFrame, speed);
}


// ----- New Round -----
function newRound() {
  
  // --- Player ---
  playerX = canvas.width / box / 2;
  playerBullets = [];
  playerShotTimer = gameSpeed;
  
  // --- Enemy ---
  enemyY = 1;
  enemyX = 0;
  enemyBullets = [];
  enemyDirection = 'right';

  enemies = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  ];

  
  // Miscellaneous
  round = 0;
  gameTimer = gameSpeed - round * 25;
  wall = false;  
}


// ----- Player Functions -----

// --- Move Right ---
function moveRight() {
  if (playerX < canvas.width / box - 1) {
    playerX += 1;
  }
}

// --- Move Left ---
function moveLeft() {
  if (playerX > 0) {
    playerX -= 1;
  }
}

// --- Shoot ---
function shoot() {
  if (playerShotTimer < 1 && !(playerBullets.some(bullet => bullet[0] === playerX && bullet[1] === playerY - 1))) {
    playerShotTimer = gameSpeed;
    playerBullets.push([playerX, playerY - 1]);
  }
}


// ----- Inputs -----

// --- Prevent Default ---
document.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
  }
});

// --- Player Input ---
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') moveLeft();
  if (event.key === 'ArrowRight') moveRight();
  if (event.code === 'Space') shoot();
});


// ----- Single Game Frame -----
function drawFrame() {
  
  // --- Canvas Reset ---
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  
  // --- Bullet Movement ---
  for (let i = 0; i < enemyBullets.length; i++) {
    enemyBullets[i][1] += 1;
  }

  for (let i = 0; i < playerBullets.length; i++) {
    playerBullets[i][1] -= 1;
  }

       
  // --- Things to run every gameSpeed ---
  if (gameTimer < 1) {
    gameTimer = gameSpeed - round * 25;
    
    // --- Enemy --- 
    
    // Move enemies
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {  
        if (
          enemies[y][x] === 1 &&
          (enemyX + x > canvas.width / box - 2 && enemyDirection === 'right' ||
          enemyX + x < 1 && enemyDirection === 'left')
        ) {
          wall = true
        }
      }
    }

    if (wall) {
      enemyDirection = (enemyDirection === 'right') ? 'left' : 'right';
      enemyY += 1;
      wall = false;
    } else {
      enemyX += (enemyDirection === 'right') ? 1 : -1;
    }
      
    
    
    // Decides which enemies shoot
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {
        if ((enemies[y][x] === 1) && (Math.floor(Math.random() * 100) < 2 + round)) {
          if (!enemyBullets.some(bullet => (bullet[0] === enemyX + x) && (bullet[1] === enemyY + y + 1))) {
            enemyBullets.push([enemyX + x, enemyY + y + 1]);
          }
        }
      }
    }
  }


  // --- Collisions ---
  
  // Enemy bullets
  for (let i = enemyBullets.length - 1; i > -1; i--) {
    if (enemyBullets[i][0] === playerX && enemyBullets[i][1] === playerY) {
      health -= 1;
      enemyBullets.splice(i, 1);
    }
  }

  // Player bullets
  for (let i = playerBullets.length - 1; i > -1; i--)  {
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {
        if (enemies[y][x] === 1 &&
            playerBullets[i][0] === enemyX + x &&
            playerBullets[i][1] === enemyY + y) {
          enemies[y][x] = 0;
          playerBullets.splice(i, 1);
          score += 10;
        }
      }
    }
  }

  // Between bullets
  for (let i = playerBullets.length - 1; i > -1; i--) {
    for (let x = enemyBullets.length - 1; x > -1; x--) {
      if (
        playerBullets[i][0] === enemyBullets[x][0] &&
        playerBullets[i][1] === enemyBullets[x][1] 
      ) {
        playerBullets.splice(i, 1);
        enemyBullets.splice(x, 1);
        break;
      }
    }
  }
  
  
  // --- Delete bullets ---
  for (let i = enemyBullets.length - 1; i > -1; i--) {
    if (enemyBullets[i][1] > canvas.width / box - 1) {
      enemyBullets.splice(i, 1);
    }
  }

  for (let i = playerBullets.length - 1; i > -1; i--) {
    if (playerBullets[i][1] < 0) {
      playerBullets.splice(i, 1);
    }
  }

  
  // --- Draw ---
  
  // Enemies
  for (let y = 0; y < enemies.length; y++) {
    for (let x = 0; x < enemies[y].length; x++) {
      if (enemies[y][x] === 1) {
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect((enemyX + x) * box, (enemyY + y) * box, box, box);
      }
    }
  }

  // Enemy Bullets
  for (let i = 0; i < enemyBullets.length; i++) {
    ctx.fillStyle = 'rgb(255, 100, 0)';
    ctx.fillRect(enemyBullets[i][0] * box + smallBox, enemyBullets[i][1] * box, smallBox, smallBox * 2);
  }

  // Player
  ctx.fillStyle = 'rgb(50, 120, 250)';
  ctx.fillRect(playerX * box, playerY * box, box, box);

  // Player Bullets
  for (let i = 0; i < playerBullets.length; i++) {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(playerBullets[i][0] * box + smallBox, playerBullets[i][1] * box + smallBox, smallBox, smallBox * 2);
  }

  // Health
  for (let i = 0; i < health - 1; i++) {
    ctx.fillStyle = 'rgb(50, 120, 250)';
    ctx.fillRect(2 * box * i + box, canvas.height - 2 * box, box, box);
  }

  // Player can shoot
  if (playerShotTimer < 1) {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    ctx.arc(canvas.width - 1.5 * box, canvas.height - 1.5 * box, Math.round(box / 2), 0, Math.PI * 2);
    ctx.fill();
  }

  // Red Line
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(0, canvas.height - 8 * box, canvas.width, 2);

  
  // --- End Game ---
  for (let y = 0; y < enemies.length; y++) {
    for (let x = 0; x < enemies[y].length; x++) {
      if (enemies[y][x] === 1 && enemyY + y > canvas.height / box - 8) {
        endGame = true;
      }
    }
  }

  
  if (health < 1 || endGame) {
    clearInterval(game);
    game = null;

    if (score > highScore) {
      highScore = score;
      
      updateHighScore().then(function() {
        scoreP.textContent = 'Score: ' + score + ' | High Score: ' + highScore
      });

      alert('New High Score!');
    } else {
      alert('Game Over');
    }
  }

  // --- New Round ---
  if (!enemies.some(row => row.some(enemy => enemy === 1))) {
    newRound();
  }

  
  // --- Timers ---
  playerShotTimer -= 1;
  gameTimer -= 1;

  // --- Update Score ---
  scoreP.textContent = 'Score: ' + score + ' | High Score: ' + highScore;
}


// --- Buttons ---
const startBtn = document.getElementById('startBtn');
const homeBtn = document.getElementById('homeBtn');
const controlsBtn = document.getElementById('controlsBtn');

startBtn.addEventListener('click', function() {
  if (!game) {
    start();
    startBtn.textContent = 'Restart';
  }
});

homeBtn.addEventListener('click', function() {
  window.location.href = 'home';
});

controlsBtn.addEventListener('click', function() {
  alert('Controls:\nSpace Bar: Shoot\nRight Arrow: Right\nLeft Arrow: Left');
});
