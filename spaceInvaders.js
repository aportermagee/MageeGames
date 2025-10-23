// --- Initialize Supabase ---
const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Set up
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 21;
const smallBox = 7;
const speed = 200;
const scoreP = document.getElementById('score');

const playerY = 18;

// High score
let highScore;

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

getHighScore().then(function() {
  scoreP.textContent = 'Score: 0 | High Score: ' + highScore;
});

async function updateHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .update({ highScoreSpaceInvaders: highScore })
    .eq('id', JSON.parse(localStorage.getItem('user')).id);

  if (error) {
    console.error(error);
  }
}

// In game variables
let health;
let playerX;
let enemyY;
let enemyX;
let enemys;
let round;

// Start
function start() {
  // Player
  playerX = 8;

  health = 3;
  
  // Enemy
  enemyY = 2;
  enemyX = 0;

  enemys = [
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
}

// Draws a frame
function drawFrame() {
  // Decides which enemies shoot
  for (let y = 0; y < enemys.length(); y++) {
    for (let x = 0; x < enemys[y].length(); y++) {
      if ((enemys === 1) && (Math.floor(Math.random() * 100) < 2.5 + round * 2.5)) {
        enemys[y + 1][x] = 2;
      }
    }
  }
}
