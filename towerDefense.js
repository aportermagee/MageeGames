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
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
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
            html.ctx.fillRect(x * constants.box, y * constants.box, constants.blankBox * 5, constants.blankBox * 5);
            break;
          case 1:
            html.ctx.fillStyle = 'rgb(0, 0, 100)';
            html.ctx.fillRect(x * constants.box, y * constants.box, constants.blankBox * 5, constants.blankBox * 5);
            break;
          case 2:
            html.ctx.fillStyle = 'rgb(0, 100, 0)';
            html.ctx.fillRect(x * constants.box, y * constants.box, constants.blankBox * 5, constants.blankBox * 5);
            break;
          case 3:
            html.ctx.fillStyle = 'rgb(100, 0, 0)';
            html.ctx.fillRect(x * constants.box, y * constants.box, constants.blankBox * 5, constants.blankBox * 5);
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

function toggleActive(button) {
  let buttons = [
    html.regular,
    html.sniper,
    html.rapidFire,
    html.tank,
  ];
  
  for (let b of buttons) {
    if (b.classList.value.includes('active')) b.classList.toggle('active');
  }
  
  button.classList.toggle('active');
}

function changeDescription(button, level) {
  html.type.textContent = descriptions[button].type;
  html.damage.textContent = descriptions[button].damage;
  html.rateOfFire.textContent = descriptions[button].rateOfFire;
  html.range.textContent = descriptions[button].range;
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
  type: document.getElementById('type'),
  damage: document.getElementById('damage'),
  rateOfFire: document.getElementById('rateOfFire'),
  range: document.getElementById('range'),
};

let constants = { 
  box: html.canvas.width / 20,
  blankBox: Math.round((html.canvas.width / 20) / 6),
  start: [0, 11],
};

let game = {
  highestWave: 0,
  grid: new Grid(),
};

let descriptions = {
  regular: {
    type: 'Regular',
    damage: 1,
    rateOfFire: 5,
    range: 3,
  },
  sniper: {
    type: 'Sniper',
    damage: 5,
    rateOfFire: 2,
    range: 7,
  },
  rapidFire: {
    type: 'RapidFire',
    damage: 1,
    rateOfFire: 10,
    range: 2,
  },
  tank: {
    type: 'Tank',
    damage: 10,
    rateOfFire: 1,
    range: 3,
  },
};
  
// --- Inputs ---
document.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
  }
});

html.regular.addEventListener('click', function() { toggleActive(html.regular); changeDescription('regular', 1); });
html.sniper.addEventListener('click', function() { toggleActive(html.sniper); changeDescription('sniper', 1); });
html.rapidFire.addEventListener('click', function() { toggleActive(html.rapidFire); changeDescription('rapidFire', 1); });
html.tank.addEventListener('click', function() { toggleActive(html.tank); changeDescription('tank', 1); });

// --- Init ---
html.ctx.imageSmoothingEnabled = false;


getHighScore().then(function() {
  html.highestWave.textContent = game.highestWave;
});

// --- Game Loops ---
game.grid.draw();
