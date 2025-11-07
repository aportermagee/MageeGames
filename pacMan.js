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
    console.log('drawling...');
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
    ctx.fillRect(this.x * box + Math.floor(box / 3) , this.y * box + Math.round(box / 3) + 3, 2, 3);
    ctx.fillRect(this.x * box + Math.floor(box * 2 / 3) , this.y * box + Math.round(box / 3) + 3, 2, 3);
  }
}

// --- Set Up ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 25;
const speed = 5;
const scoreP = document.getElementById('score');

const blue = new Ghost(0, 0, 'rgb(0, 0, 255)');
blue.draw();
