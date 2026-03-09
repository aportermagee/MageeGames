class Player {
  constructor() {
    this.shots = [];
    this.angle = Math.PI / 2;
    this.speed = 4;
    this.turn = 2;
    this.coolDown = 0.25;
  }
  
  update(delta) {
    
  }
  
  draw() {
    html.ctx.strokeStyle = 'rgb(100, 150, 200)';
    html.ctx.lineWidth = 2;
    html.ctx.beginPath();
    html.ctx.moveTo(game.center.x, game.center.y - 15);
    html.ctx.lineTo(game.center.x + 8, game.center.y + 10);
    html.ctx.lineTo(game.center.x, game.center.y + 5);
    html.ctx.lineTo(game.center.x - 8, game.center.y + 10);
    html.ctx.lineTo(game.center.x, game.center.y - 15);
    html.ctx.stroke();
    
    html.ctx.fillStyle = 'rgb(0, 75, 150)';
    html.ctx.beginPath();
    html.ctx.moveTo(game.center.x, game.center.y - 15);
    html.ctx.lineTo(game.center.x + 8, game.center.y + 10);
    html.ctx.lineTo(game.center.x, game.center.y + 5);
    html.ctx.lineTo(game.center.x - 8, game.center.y + 10);
    html.ctx.lineTo(game.center.x, game.center.y - 15);
    html.ctx.fill();
  }
}

class Enemy {
  constructor(posx, posy, angle) {
    this.pos = {
      x: posx,
      y: posy,
    };
    this.angle = angle;
    this.turn = 1.9;
    this.shots = [];
    this.speed = 4;
    this.coolDown = 0.5;
  }
  
  update(delta) {
    
  }
  
  draw() {
    
  }
}

class SpeedLine {
  constructor() {
    this.pos = {
      x: Math.round(Math.random() * html.canvas.width / 2),
      y: Math.round(Math.random() * html.canvas.height / 4),
    };
    this.speed = Math.round(Math.random() * 20) + 80;
    this.time = performance.now();
    this.length = Math.round(Math.random() * 50) + 20;
  }
  
  update(delta) {
    if (performance.now() - this.time >= 1000) {
      game.speedLines = game.speedLines.filter(line => line !== this);
    }
    
    this.pos.y += delta * 5 * this.speed / 1000;
  }
  
  draw() {
    html.ctx.fillStyle = 'rgb(150, 150, 150)';
    html.ctx.fillRect(this.pos.x, this.pos.y, 1, this.length);
  }
}

// --- Functions ---
function turn(ship, direction, delta) {
  ship.angle += ship.turn * direction * delta;
}

function update(delta) {
  game.player.update(delta);
  
  for (let i = 0; i < game.enemies.length; i++) {
    game.enemies[i].update(delta);
  }
  
  for (let i = 0; i < game.speedLines.length; i++) {
    game.speedLines[i].update(delta);
  }
}

function draw() {
  html.ctx.fillStyle = 'rgb(0, 0, 0)';
  html.ctx.fillRect(0, 0, html.canvas.width, html.canvas.height);
  
  for (let i = 0; i < game.speedLines.length; i++) {
    game.speedLines[i].draw();
  }
  
  game.player.draw();
  
  for (let i = 0; i < game.enemies.length; i++) {
    game.enemies[i].draw();
  }
}

// --- Variables ---
let html = {
  canvas: document.getElementById('canvas'),
  ctx: document.getElementById('canvas').getContext('2d'),
}

let game = {
  enemies: [],
  center: {
    x: Math.round(html.canvas.width / 2),
    y: Math.round(html.canvas.height / 2),
  },
  player: new Player(),
  speedLines: [],
  lastTime: performance.now(),
  lastSpeedLine: performance.now(),
}

// --- Game Loop ---
function gameLoop(currentTime) {
  let delta = currentTime - game.lastTime;
  game.lastTime = currentTime;
  
  if (currentTime - game.lastSpeedLine >= 50) {
    game.speedLines.push(new SpeedLine());
    game.lastSpeedLine = currentTime;
  }
  
  update(delta);
  draw();
  
  requestAnimationFrame(gameLoop);
}

// --- Initialization ---
const dpr = window.devicePixelRatio || 1;
html.canvas.width = 800 * dpr;
html.canvas.height = 600 * dpr;
html.canvas.style.width = '800px';
html.canvas.style.height = '600px';
html.ctx.scale(dpr, dpr);

requestAnimationFrame(gameLoop);
