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

const box = 21;
const smallBox = 7;
const speed = 25;
const gameSpeed = 200 / speed;
const scoreP = document.getElementById('score');

const playerY = 18;


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


// ----- Start Of Game -----
function start() {
  
  // --- Player ---
  playerX = 8;
  health = 3;
  playerBullets = [];
  playerShotTimer = 3 * gameSpeed;

  
  // --- Enemy ---
  enemyY = 2;
  enemyX = 0;
  enemyBullets = [];

  enemies = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  
  // Miscellaneous
  score = 0;
  round = 0;
  gameTimer = gameSpeed;

  // Game Loop
  game = setInterval(drawFrame, speed);
}

// ----- Player Functions -----

// --- Move Right ---
function moveRight() {
  if (playerX < 19) {
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
    playerShotTimer = 3 * gameSpeed;
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

  
  // --- Things to run every 200 millaseconds ---
  if (gameTimer < 1) {
    gameTimer = gameSpeed;
    
    // --- Enemy ---
      
    // Move enemies
    if ((enemyX + enemies[0].length) < 19) {
      enemyX += 1;
    } else {
      enemyY += 1;
    }
    
    // Decides which enemies shoot
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {
        if ((enemies[y][x] === 1) && (Math.floor(Math.random() * 100) < 2.5 + round * 2.5)) {
          if (!enemyBullets.some(bullet => (bullet[0] === enemyX + x) && (bullet[1] === enemyY + y + 1))) {
            enemyBullets.push([enemyX + x, enemyY + y + 1]);
          }
        }
      }
    }
  }
  
  // ----- Collisions -----

  // --- Bullets ---
  for (let i = enemyBullets.length - 1; i > -1; i--) {
    if (enemyBullets[i][0] === playerX && enemyBullets[i][1] === playerY) {
      health -= 1;
      enemyBullets.splice(i, 1);
    }
  }

  for (let i = enemyBullets.length - 1; i > -1; i--)  {
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {
        if (enemies[y][x] === 1 &&
            playerBullets[i][0] === enemyX + x &&
            playerBullets[i][1] === enemyY + y) {
          enemies[y][x] = 0;
          playerBullets.splice(i, 1);
          score += 10;
          break;
        }
      }
    }
  }
  
  // --- Delete bullets ---
  for (let i = enemyBullets.length - 1; i > -1; i--) {
    if (enemyBullets[i][1] > 19) {
      enemyBullets.splice(i, 1);
    }
  }

  for (let i = enemyBullets.length - 1; i > -1; i--) {
    if (playerBullets[i][1] < 0) {
      playerBullets.splice(i, 1);
    }
  }

  
  // --- End Game ---
  if (
    health < 1 ||
    enemyY + enemies.length > 16
  ) {
    clearInterval(game);
    game = null;

    if (score > highScore) {
      highScore = score;
      
      updateHighScore().then(function() {
        scoreP.textContent = 'Score: ' + score + ' | High Score: ' + highScore
      });
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

  
  // --- Timers ---
  playerShotTimer -= 1;
  gameTimer -= 1;

  // --- Update Score ---
  scoreP.textContent = 'Score: ' + score + ' | High Score: ' + highScore;
}


// --- Buttons ---
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', function() {
  if (!game) {
    start();
    startBtn.textContent = 'Restart';
  }
}
