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

// --- High Score ---
let highScore;

async function getHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .select('highScorePacMan')
    .eq('id', JSON.parse(localStorage.getItem('user')).id)
    .single();

  if (error) {
    console.error(error);
  } else {
    highScore = data.highScorePacMan;
  }
}

getHighScore().then(function() {
  document.getElementById('score').textContent = 'Score: 0 | High Score: ' + highScore;
});

async function updateHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .update({ highScorePacMan: highScore })
    .eq('id', JSON.parse(localStorage.getItem('user')).id);

  if (error) {
    console.error(error);
  }
}

// --- Ghost Class ---
class Ghost {
  constructor (x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x * box + Math.floor(box / 2), this.y * box + Math.floor(box / 2), Math.floor(box / 2), Math.PI, 0, false);
    ctx.lineTo(this.x * box + box, this.y * box + box);
    ctx.lineTo(this.x * box + Math.round(box * 3 / 4), this.y * box + Math.round(box * 5 / 6));
    ctx.lineTo(this.x * box + Math.round(box / 2), this.y * box + box);
    ctx.lineTo(this.x * box + Math.round(box / 4), this.y * box + Math.round(box * 5 / 6));
    ctx.lineTo(this.x * box, this.y * box + box);
    ctx.lineTo(this.x * box, this.y * box + Math.round(box / 2));
    ctx.fill();

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(this.x * box + Math.floor(box / 3) - 1, this.y * box + Math.round(box / 3), 4, 6);
    ctx.fillRect(this.x * box + Math.floor(box * 2 / 3) - 1, this.y * box + Math.round(box / 3), 4, 6);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(this.x * box + Math.floor(box / 3), this.y * box + Math.round(box / 3) + 3, 2, 3);
    ctx.fillRect(this.x * box + Math.floor(box * 2 / 3), this.y * box + Math.round(box / 3) + 3, 2, 3);
  }
}

// --- Pac-Man Class ---
class PacMan {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.color = 'rgb(255, 255, 0)';
    this.mouth = 0.05;
    this.direction = 'right';
    this.mouthDirection = 1;
  }

  draw () {
    ctx.fillStyle = this.color;
    let centerX = this.x * box + box / 2;
    let centerY = this.y * box + box / 2;
    let radius = box / 2;
    let startAngle, endAngle;
    const mouthSize = this.mouth * Math.PI;
    const directions = {
      right: 0,
      down: 0.5 * Math.PI,
      left: Math.PI,
      up: 1.5 * Math.PI
    };
    startAngle = directions[this.direction] + mouthSize;
    endAngle = directions[this.direction] - mouthSize; 
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
     
    this.mouth += 0.05 * this.mouthDirection;
      
    if (this.mouth >= 0.3 || this.mouth <= 0.05) {
        this.mouthDirection *= -1;
    }
  }
}

// --- Maze Class ---
class Maze {
  constructor () {
    this.rows = canvas.width / box;
    this.columns = canvas.height / box;
    this.layout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, -1, -1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [-1, -1, -1, -1, -1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, -1, -1, -1, -1, -1],   
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],    
    ];
  }

  draw () {
    for (let y = 0; y < this.columns; y++) {
      for(let x = 0; x < this.rows; x++) {
        switch (this.layout[y][x]) {
          case 1:
            ctx.fillStyle = 'rgb(0, 0, 120)';
            ctx.fillRect(x * box, y * box, box, box);
                
            ctx.strokeStyle = 'rgb(0, 0, 130)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x * box + 1, y * box + 1, box - 2, box - 2);
            break;
          case 0:
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            ctx.arc(x * box + box / 2, y * box + box / 2, Math.floor(box / 5), 0, Math.PI * 2, false);
            ctx.fill();
            break;
          case 2:
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            ctx.arc(x * box + box / 2, y * box + box / 2, Math.floor(box / 3), 0, Math.PI * 2, false);
            ctx.fill();
            break;
          case 3:
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(x * box, y * box, box, 4);
            break;
        }
      }
    }
  }
}

// --- Set Up ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const box = 26;
const speed = 5;
const scoreP = document.getElementById('score');


// --- Testing ---
const blue = new Ghost(1, 1, 'rgb(0, 200, 250)');
const red = new Ghost(2, 1, 'rgb(255, 0, 0)');
const pink = new Ghost(3, 1, 'rgb(255, 150, 255)');
const orange = new Ghost(4, 1, 'rgb(255, 130, 0)');
const pacMan = new PacMan(5, 1);
const maze = new Maze();

function draw() {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    maze.draw();
    
    blue.draw();
    red.draw();
    pink.draw();
    orange.draw();
    pacMan.draw();
}

testLoop = setInterval(draw, 100);
