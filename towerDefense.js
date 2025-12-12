// --- Set Up ---
if (!localStorage.getItem('loggedIn') === 'true') {
  window.location.href = 'index.html';
}

const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Classes ---
class Canvas {
  constructor() {
    this.line = [
      [0, 250], [200, 250], [100, 100],
      [350, 100], [350, 400], [600, 400],
      [500, 250], [700, 250],
    ];
    this.linePositions = this.getLinePositions();
  }

  getLinePositions() {
    let lengths = [0];
    for (let i = 1; i < this.line.length; i++) {
      lengths.push(lengths.at(-1) + Math.sqrt(Math.pow(this.line[i - 1][0] - this.line[i][0], 2) + Math.pow(this.line[i - 1][1] - this.line[i][1], 2)));
    }
    return lengths;
  }
  
  draw() {
    html.ctx.strokeStyle = 'rgb(50, 50, 255)';
    html.ctx.lineWidth = 3;
    
    html.ctx.beginPath();
    html.ctx.moveTo(this.line[0][0], this.line[0][1]);
    for (let i = 1; i < this.line.length; i++) {
      html.ctx.lineTo(this.line[i][0], this.line[i][1]);
    }
    html.ctx.stroke();
  }
}

class Regular {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.damage = 1;
    this.rateOfFire = 3;
    this.range = 50;
    this.cost = 50;
    this.upgrade = {
      damage: 0.5,
      rateOfFire: 0.5,
      range: 5,
      cost: 50,
    };
  }

  draw() {
    html.ctx.fillStyle = 'rgb(0, 200, 0)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    html.ctx.fill();
  }
}

class Sniper {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.damage = 5;
    this.rateOfFire = 1;
    this.range = 100;
    this.cost = 150;
    this.upgrade = {
      damage: 1,
      rateOfFire: 0.25,
      range: 10,
      cost: 75,
    };
  }

  draw() {
    html.ctx.fillStyle = 'rgb(0, 0, 255)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    html.ctx.fill();
  }
}

class RapidFire {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.damage = 1;
    this.rateOfFire = 7;
    this.range = 70;
    this.cost = 100;
    this.upgrade = {
      damage: 0.5,
      rateOfFire: 1,
      range: 0.25,
      cost: 100,
    };
  }

  draw() {
    html.ctx.fillStyle = 'rgb(210, 190, 0)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    html.ctx.fill();
  }
}

class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.damage = 10;
    this.rateOfFire = 1;
    this.range = 40;
    this.cost = 150;
    this.upgrade = {
      damage: 3,
      rateOfFire: 0.1,
      range: 5,
      cost: 100,
    };
  }

  draw() {
    html.ctx.fillStyle = 'rgb(0, 200, 0)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    html.ctx.fill();
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

function toggleActive(tower) {
  const towers = [
    html.regular,
    html.sniper,
    html.rapidFire,
    html.tank,
  ];
  
  for (let t of towers) {
    if (t.classList.value.includes('active')) t.classList.toggle('active');
  }
  
  html[tower].classList.toggle('active');
  
  game.activeTower = tower;
}

function changeDescription(tower, level) {
  html.type.textContent = descriptions[tower].type;
  html.damage.textContent = descriptions[tower].damage;
  html.rateOfFire.textContent = descriptions[tower].rateOfFire;
  html.range.textContent = descriptions[tower].range;
}

function distanceToLineSegment(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
}

function placeTower(event, tower) {
  const rect = html.canvas.getBoundingClientRect();
  
  const x = Math.abs(event.clientX - rect.left);
  const y = Math.abs(event.clientY - rect.top);

  let invalidPlacement = false;
  
  for (let tower of game.towers) {
    const distance = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
    if (distance < 25) {
      invalidPlacement = true;
      break;
    }
  }
  
  for (let i = 0; i < game.canvas.line.length - 1; i++) {
    const x1 = game.canvas.line[i][0];
    const y1 = game.canvas.line[i][1];
    const x2 = game.canvas.line[i + 1][0];
    const y2 = game.canvas.line[i + 1][1];
    
    const distance = distanceToLineSegment(x, y, x1, y1, x2, y2);
    
    if (distance < 25) {
      invalidPlacement = true;
      break;
    }
  }
  
  if (invalidPlacement) {
    html.error.textContent = 'Invalid Tower Placement';
    setTimeout(() => html.error.textContent = '', 2000);
    return;
  } else if (descriptions[game.activeTower].cost > game.cash) {
    html.error.textContent = 'Insufficient Funds';
    setTimeout(() => html.error.textContent = '', 2000);
    return;
  } else {
    switch(game.activeTower) {
      case 'regular': game.towers.push(new Regular(x, y)); break;
      case 'sniper': game.towers.push(new Sniper(x, y)); break;
      case 'rapidFire': game.towers.push(new RapidFire(x, y)); break;
      case 'tank': game.towers.push(new Tank(x, y)); break;
    }
    game.cash -= descriptions[game.activeTower].cost;
  }
  
  draw();
}

function draw() {
  html.ctx.fillStyle = 'rgb(0, 0, 20)';
  html.ctx.fillRect(0, 0, html.canvas.width, html.canvas.height);
  
  game.canvas.draw();

  for (let tower: game.towers) {
    tower.draw();
  }

  html.cash.textContent = game.cash;
  html.wave.textContent = game.wave;
  html.lives.textContent = game.lives;
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
  error: document.getElementById('error'),
};

let constants = { 
  
};

let game = {
  highestWave: 1,
  canvas: new Canvas(),
  cash: 100,
  wave: 1,
  lives: 15,
  activeTower: 'regular',
  towers: [],
  enemies: [],
  bullets: [],
};

let descriptions = {
  regular: {
    type: 'Regular',
    damage: 1,
    rateOfFire: 3,
    range: 50,
    cost: 50,
  },
  sniper: {
    type: 'Sniper',
    damage: 5,
    rateOfFire: 1,
    range: 100,
    cost: 100,
  },
  rapidFire: {
    type: 'RapidFire',
    damage: 1,
    rateOfFire: 7,
    range: 70,
    cost: 100,
  },
  tank: {
    type: 'Tank',
    damage: 10,
    rateOfFire: 1,
    range: 40,
    cost: 150,
  },
};
  
// --- Inputs ---
document.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
  }
});

html.regular.addEventListener('click', function() { toggleActive('regular'); changeDescription('regular', 1); });
html.sniper.addEventListener('click', function() { toggleActive('sniper'); changeDescription('sniper', 1); });
html.rapidFire.addEventListener('click', function() { toggleActive('rapidFire'); changeDescription('rapidFire', 1); });
html.tank.addEventListener('click', function() { toggleActive('tank'); changeDescription('tank', 1); });

html.canvas.addEventListener('click', event => placeTower(event, game.activeTower));

html.home.addEventListener('click', function() { window.location.href = 'home'; });

// --- Init ---
html.ctx.imageSmoothingEnabled = false;


getHighScore().then(function() {
  html.highestWave.textContent = game.highestWave;
});

toggleActive('regular');

// --- Game Loops ---
draw()
