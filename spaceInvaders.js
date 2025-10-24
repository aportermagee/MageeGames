// Checks if the user is logged in
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
const speed = 200;
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


// ----- Start Of Game -----
function start() {
  
  // --- Player ---
  playerX = 8;
  health = 3;

  
  // --- Enemy ---
  enemyY = 2;
  enemyX = 0;

  enemies = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  enemyBullets = [];

  
  // Score
  score = 0;

  // Game Loop
  game = setInterval(drawFrame(), speed);
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

  
  // --- Enemy ---
  
  // Move enemies
  if ((enemyX + enemies[0].length) < 19) {
    enemyX += 1;
  } else {
    enemyY += 1;
  }
  
  // Decides which enemies shoot
  for (let y = 0; y < enemys.length; y++) {
    for (let x = 0; x < enemys[y].length; y++) {
      if ((enemys === 1) && (Math.floor(Math.random() * 100) < 2.5 + round * 2.5)) {
        if (!enemyBullets.some(bullet => (bullet[0] === enemyX + x) && (bullet[1] === enemyY + y + 1))) {
          enemyBullets.push([enemyX + x, enemyY + y + 1]);
        }
      }
    }
  }

  
  // --- Collisions ---

  // Enemy bullets
  for (let i = 0; i < enemyBullets.length; i++) {
    if (enemyBullets[i][0] === playerX && enemyBullets[i][1] === playerY) {
      health -= 1;
      enemyBullets.splice(i, 1);
    }
  }

  // Delete bullets
  for (let i = 0; i < enemyBullets.length; i++) {
    if (enemyBullets[i][1] > 19) {
      enemyBullets.splice(i, 1);
    }
  }

  
  // --- End Game ---
  if (
    health < 1 ||
    enemyY + enemies.length > 16
  ) {
    removeInterval(game);
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
  ctx.fillRect(playerX, playerY, box, box);
}
