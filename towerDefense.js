// --- Set Up ---
if (!localStorage.getItem('loggedIn') === 'true') {
  window.location.href = 'index.html';
}

const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Classes ---
class Grid {
  constructor() {
    this.layout = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  draw() {
    for (let y = 0; y < this.layout.length; y++) {
      for (let x = 0; x < this.layout[y].length; x++) {
        switch (this.layout[y][x]) {
          case 0:
            html.ctx.fillStyle = 'rgb(0, 0, 50)';
            html.ctx.fillRect(x * constants.box + constants.blankBox, y * constants.box + constants.blankBox, constants.blankBox * 3, constants.blankBox * 3);
            break;
          case 1:
            html.ctx.fillStyle = 'rgb(0, 0, 100)';
            html.ctx.fillRect(x * constants.box + constants.blankBox, y * constants.box + constants.blankBox, constants.blankBox * 3, constants.blankBox * 3);
            break;
        }
      }
    }
  }
}

// --- Functions ---
async function getHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .select('highestWaveTowerDefense')
    .eq('id', JSON.parse(localStorage.getItem('user')).id)
    .single();

  if (error) {
    console.error(error);
  } else {
    game.highestWave = data.highestWaveTowerDefense;
  }
}


async function updateHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .update({ highestWaveTowerDefense: game.highestWave })
    .eq('id', JSON.parse(localStorage.getItem('user')).id);

  if (error) {
    console.error(error);
  }
}

// --- Variables ---
let html = {
  canvas: document.getElementById('game'),
  ctx: document.getElementById('game').getContext('2d'),
  highestWave: document.getElementById('highestWave'),
  wave: document.getElementById('wave'),
  cash: document.getElementById('cash'),
  lives: document.getElementById('lives'),
  start: document.getElementById('start'),
  update: document.getElementById('update'),
  delete: document.getElementById('delete'),
  home: document.getElementById('home'),   
  regular: document.getElementById('regular'),
  sniper: document.getElementById('sniper'),
  rapidFire: document.getElementById('rapidFire'),
  tank: document.getElementById('tank'),
  description: document.getElementById('description'),
};

let constants = { 
  box: html.canvas.width / 20,
  blankBox: Math.round((html.canvas.width / 20) / 5),
  start: [0, 11],
};

let game = {
  highestWave: 0,
  grid: new Grid(),
};

// --- Inputs ---
document.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
  }
});

// --- Init ---
html.ctx.imageSmoothingEnabled = false;


getHighScore().then(function() {
  html.highestWave.textContent = game.highestWave;
});

// --- Game Loops ---
game.grid.draw();
