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

const box = 4;
const speed = 20;
const gameSpeed = 400 / speed;
const scoreP = document.getElementById('score');

const playerY = canvas.height / box - 12;

const defensesY = canvas.height / box - 21;


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
let playerRight = false;
let playerLeft = false;
let defenses;
let defensesX;
let num;


// ----- Start Of Game -----
function start() {
  
  // --- Player ---
  playerX = canvas.width / box / 2;
  health = 3;
  playerBullets = [];
  playerShotTimer = gameSpeed * 2;

  
  // --- Enemy ---
  enemyY = 8;
  enemyX = 0;
  enemyBullets = [];
  enemyDirection = 'right';
  
  enemies = [];

  for (let x = 0; x < 4; x++) {
    let temp = [];
    for (let i = 0; i < 10; i++) {
      temp.push(1);
    }
    enemies.push(temp);
  }


  // --- Defenses ---
  let first = canvas.width / box / 4.5;
  defensesX = [0.5 * first, 1.5 * first, 2.5 * first, 3.5 * first].map(Math.round);
  defenses = [];
  
  for (let i = 0; i < 4; i++) {
    defenses.push([
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1]
    ]);
  }    

  
  // Miscellaneous
  score = 0;
  round = 0;
  gameTimer = Math.max(1, gameSpeed - round * 10);
  endGame = false;
  wall = false;
  num = 0;

  // Game Loop
  game = setInterval(drawFrame, speed);
}


// ----- New Round -----
function newRound() {
  
  // --- Player ---
  playerX = canvas.width / box / 2;
  playerBullets = [];
  playerShotTimer = gameSpeed * 2;
  
  // --- Enemy ---
  enemyY = 8;
  enemyX = 0;
  enemyBullets = [];
  enemyDirection = 'right';
  
  enemies = [];

  for (let x = 0; x < 4; x++) {
    let temp = [];
    for (let i = 0; i < 10; i++) {
      temp.push(1);
    }
    enemies.push(temp);
  }
  

  // --- Defenses ---
  let first = canvas.width / box / 4.5;
  defensesX = [0.5 * first, 1.5 * first, 2.5 * first, 3.5 * first].map(Math.round);
  defenses = [];
  
  for (let i = 0; i < 4; i++) {
    defenses.push([
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1]
    ]);
  }   
  
  
  // Miscellaneous
  gameTimer = Math.max(1, gameSpeed - round * 10);
  wall = false;  
  num = 0;
}


// ----- Player Functions -----

// --- Move Right ---
function moveRight() {
  if (playerX + 2 < canvas.width / box - 1) {
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
  if (playerShotTimer < 1 &&
    !playerBullets.some(bullet => (bullet[0] === playerX + 1) && 
    ([playerY - 1, playerY - 2, playerY - 3].includes(bullet[1])))
     ) {
    playerShotTimer = gameSpeed * 2;
    playerBullets.push([playerX + 1, playerY - 2]);
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
  if (event.key === 'ArrowLeft') playerLeft = true;
  if (event.key === 'ArrowRight') playerRight = true;
  if (event.code === 'Space') shoot();
});

document.addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft') playerLeft = false;
  if (event.key === 'ArrowRight') playerRight = false;
});


// ----- Collisions -----
function playerBulletCollisions(i)  {
  for (let x = enemyBullets.length - 1; x > -1; x--) {
    if (
      playerBullets[i][0] === enemyBullets[x][0] &&
      [enemyBullets[x][1] - 1, enemyBullets[x][1], enemyBullets[x][1] + 1].includes(playerBullets[i][1])
    ) {
      playerBullets.splice(i, 1);
      enemyBullets.splice(x, 1);
      return true;
    }
  }
  
  for (let y = 0; y < enemies.length; y++) {
    for (let x = 0; x < enemies[y].length; x++) {
      if (enemies[y][x] === 1 &&
          [enemyX + x * 6, enemyX + x * 6 + 1, enemyX + x * 6 + 2].includes(playerBullets[i][0]) &&
          [enemyY + y * 6, enemyY + y * 6 + 1, enemyY + y * 6 + 2].includes(playerBullets[i][1])
         ) {                                                                                                                                                                   
        enemies[y][x] = 0;
        playerBullets.splice(i, 1);
        score += 10;
        return true;
      }
    }
  }
  
  for (let z = 0; z < 4; z++) {
    for (let y = 0; y < defenses[z].length; y++) {
      for (let x = 0; x < defenses[z][y].length; x++) {
        if (defenses[z][y][x] === 1 &&
           playerBullets[i][0] === defensesX[z] + x &&
           playerBullets[i][1] === defensesY + y
        ) {
          defenses[z][y][x] = 0;
          playerBullets.splice(i, 1);
          return true;
        }
      }
    }
  }  
  
  if (playerBullets[i][1] + 1 < 0) {
    playerBullets.splice(i, 1);
    return true;
  }

  return false;
}

function enemyBulletCollisions(i) {
  for (let x = playerBullets.length - 1; x > -1; x--) {
    if (
      enemyBullets[i][0] === playerBullets[x][0] &&
      [playerBullets[x][1] - 1, playerBullets[x][1], playerBullets[x][1] + 1].includes(enemyBullets[i][1])
    ) {
      enemyBullets.splice(i, 1);
      playerBullets.splice(x, 1);
      return true;
    }
  }
  
  if ([playerX, playerX + 1, playerX + 2].includes(enemyBullets[i][0]) &&
      [playerY, playerY + 1, playerY + 2].includes(enemyBullets[i][1])) {
    health -= 1;
    enemyBullets.splice(i, 1);
    return true;
  }

  for (let z = 0; z < 4; z++) {
    for (let y = 0; y < defenses[z].length; y++) {
      for (let x = 0; x < defenses[z][y].length; x++) {
        if (defenses[z][y][x] === 1 &&
           enemyBullets[i][0] === defensesX[z] + x &&
           enemyBullets[i][1] === defensesY + y
        ) {
          defenses[z][y][x] = 0;
          enemyBullets.splice(i, 1);
          return true;
        }
      }
    }
  }  
  
  if (enemyBullets[i][1] > canvas.height / box - 1) {
    enemyBullets.splice(i, 1);
    return true;
  }
  return false;
}


// ----- Single Game Frame -----
function drawFrame() {
  
  // --- Canvas Reset ---
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // --- Player Motion ---
  if (playerRight && gameTimer % 3 === 0) moveRight();
  if (playerLeft && gameTimer % 3 === 0) moveLeft();
  
  
  // --- Bullet Movement ---
  if (gameTimer % 2 === 0) {
    for (let i = enemyBullets.length - 1; i > -1; i--) {
      for (let y = 0; y < 3; y++) {
        enemyBullets[i][1] += 1;
        if (enemyBulletCollisions(i)) break;
      }
    }
  }

  for (let i = playerBullets.length - 1; i > -1; i--) {
    for (let y = 0; y < 3; y++) {
      playerBullets[i][1] -= 1;
      if (playerBulletCollisions(i)) break;
    }
  }

       
  // --- Things to run every gameSpeed ---
  if (gameTimer < 1) {
    gameTimer = Math.max(20, gameSpeed - round * 10 - Math.round(num));
    
    // --- Enemy --- 
    
    // Move enemies
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {  
        if (
          enemies[y][x] === 1 &&
          (enemyX + x * 6 + 2 > canvas.width / box - 2 && enemyDirection === 'right' ||
          enemyX + x * 6 < 1 && enemyDirection === 'left')
        ) {
          wall = true
        }
      }
    }

    if (wall) {
      enemyDirection = (enemyDirection === 'right') ? 'left' : 'right';
      enemyY += 3;
      wall = false;
    } else {
      enemyX += (enemyDirection === 'right') ? 1 : -1;
    }
      
    
    // Decides which enemies shoot
    for (let y = 0; y < enemies.length; y++) {
      for (let x = 0; x < enemies[y].length; x++) {
        if ((enemies[y][x] === 1) && (Math.round(Math.random() * 100) < 3 + round)) {
          if (!enemyBullets.some(bullet => (enemyX + x * 6 + 1 === bullet[0]) && 
            ([enemyY + y * 6 + 2, enemyY + y * 6 + 3, enemyY + y * 6 + 4].includes(bullet[1])))
             ) {
            enemyBullets.push([enemyX + x * 6 + 1, enemyY + y * 6 + 3]);
          }
        }
      }
    }
  }

  
  // --- Draw ---
  
  // Enemies
  for (let y = 0; y < enemies.length; y++) {
    for (let x = 0; x < enemies[y].length; x++) {
      if (enemies[y][x] === 1) {
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect((enemyX + x * 6) * box, (enemyY + y * 6) * box, box * 3, box * 3);
      }
    }
  }

  // Enemy Bullets
  for (let i = 0; i < enemyBullets.length; i++) {
    ctx.fillStyle = 'rgb(255, 100, 0)';
    ctx.fillRect(enemyBullets[i][0] * box, enemyBullets[i][1] * box, box, box * 2);
  }

  // Player
  ctx.fillStyle = 'rgb(50, 120, 250)';
  ctx.fillRect(playerX * box, playerY * box, box * 3, box * 3);

  // Player Bullets
  for (let i = 0; i < playerBullets.length; i++) {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(playerBullets[i][0] * box, playerBullets[i][1] * box, box, box * 2);
  }

  // Health
  for (let i = 0; i < health - 1; i++) {
    ctx.fillStyle = 'rgb(50, 120, 250)';
    ctx.fillRect(6 * box * i + box * 3, canvas.height - 6 * box, box * 3, box * 3);
  }

  // Player can shoot
  if (playerShotTimer < 1) {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    ctx.arc(canvas.width - 1.5 * box * 3, canvas.height - 1.5 * box * 3, Math.round(1.5 * box), 0, Math.PI * 2);
    ctx.fill();
  }

  // Red Line
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(0, canvas.height - 24 * box, canvas.width, 2);

  // Defenses
  for (let i = 0; i < 4; i++) {
    for (let y = 0; y < defenses[i].length; y++) {
      for (let x = 0; x < defenses[i][y].length; x++) {
        if (defenses[i][y][x] === 1) {
          ctx.fillStyle = 'rgb(0, 170, 50)';
          ctx.fillRect((defensesX[i] + x) * box, (defensesY + y) * box, box, box);
        }
      }
    }
  }
  
  // Text
  ctx.font = '15px Arial';
  ctx.fillStyle = 'rgb(255, 255, 255)';

  ctx.textAlign = 'left';
  ctx.fillText('High Score: ' + highScore, box, box * 3);

  ctx.textAlign = 'right';
  ctx.fillText('Round: ' + (round + 1), canvas.width - box, box * 3);
  
  ctx.textAlign = 'center';
  ctx.fillText('Score: ' + score, canvas.width / 2, box * 3);

  
  // --- End Game ---
  for (let y = 0; y < enemies.length; y++) {
    for (let x = 0; x < enemies[y].length; x++) {
      if (enemies[y][x] === 1 && enemyY + y * 6 > canvas.height / box - 24) {
        endGame = true;
      }
    }
  }

  
  if (health < 1 || endGame) {
    clearInterval(game);
    game = null;

    if (score > highScore) {
      highScore = score;
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
  num += 1 / 500;
}


// --- Buttons ---
const startBtn = document.getElementById('startBtn');
const homeBtn = document.getElementById('homeBtn');
const controlsBtn = document.getElementById('controlsBtn');
const infoBtn = document.getElementById('infoBtn');

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

infoBtn.addEventListener('click', function() {
  alert('Shoot enemy ships to increase your score\n\nThe green blocks are your defenses\n\nThe white circle indicates when you can shoot\n\nWhen all enemy ships are eliminated, the next round will start\n\nThe ships in the bottom left are reserves, if you are hit when there are no more reserve ships, the game ends\n\nIf an enemy ship reaches the red line the game ends\n\nGood luck!');
});

newRound()
drawFrame()
