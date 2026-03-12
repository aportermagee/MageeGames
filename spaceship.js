
class Player {
  constructor() {
    this.pos = {
      x: Math.round(html.canvas.width / 2),
      y: Math.round(html.canvas.height / 2),
    };
    this.shots = [];
    this.angle = Math.PI / 2;
    this.speed = 200;
    this.turnSpeed = 2;
    this.turn = 0;
    this.coolDown = 0.25;
  }
  
  update(delta) {
    if (this.turn !== 0) {
      for (let enemy of game.enemies) {
        let ta = this.turnSpeed * this.turn * delta;
        
        let dx = this.pos.x - enemy.pos.x;
        let dy = this.pos.y - enemy.pos.y;
        
        let ca = Math.atan2(dy, dx);
        let na = ca - ta;
        
        enemy.pos.x += Math.cos(na) - Math.cos(ca);
        enemy.pos.y += Math.sin(na) - Math.sin(ca);
        
        enemy.angle -= ta;
      }
    }
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
  constructor() {
    this.pos = {
      x: Math.round(Math.random() * html.canvas.width * 2) - html.canvas.width / 2,
      y: Math.round(Math.random() * html.canvas.height * 2) - html.canvas.height / 2,
    };
    this.angle = Math.round(Math.random() * Math.PI * 2);
    this.turnSpeed = 2;
    this.shots = [];
    this.speed = Math.round(Math.random() * 50) + 175;
    this.coolDown = 0.5;
  }
  
  update(delta) {
    let dt = delta / 1000;
    
    this.pos.x += Math.cos(this.angle) * this.speed * dt;
    this.pos.y += (Math.sin(this.angle) * this.speed + game.player.speed) * dt;

    let dx = game.player.pos.x - this.pos.x;
    let dy = game.player.pos.y - this.pos.y;
    let targetAngle = Math.atan2(dy, dx);
    
    let angleDiff = targetAngle - this.angle;
    let direction = (angleDiff > 0) ? 1 : -1;
    turn(this, direction, dt);
  }
  
  draw() {
    html.ctx.save();
    html.ctx.translate(this.pos.x, this.pos.y);
    html.ctx.rotate(this.angle + Math.PI / 2);
    html.ctx.strokeStyle = 'rgb(200, 100, 0)';
    html.ctx.lineWidth = 2;
    html.ctx.beginPath();
    html.ctx.moveTo(0, -15);
    html.ctx.lineTo(8, 10);
    html.ctx.lineTo(0, 5);
    html.ctx.lineTo(-8, 10);
    html.ctx.lineTo(0, -15);
    html.ctx.stroke();
    
    html.ctx.fillStyle = 'rgb(150, 75, 0)';
    html.ctx.beginPath();
    html.ctx.moveTo(0, -15);
    html.ctx.lineTo(8, 10);
    html.ctx.lineTo(0, 5);
    html.ctx.lineTo(-8, 10);
    html.ctx.lineTo(0, -15);
    html.ctx.fill();
    html.ctx.restore();
  }
}

class SpeedLine {
  constructor() {
    this.pos = {
      x: Math.round(Math.random() * html.canvas.width / 2),
      y: Math.round(Math.random() * html.canvas.height / 4) - 70,
    };
    this.speed = Math.round(Math.random() * 30) + 80;
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
  ship.angle += ship.turnSpeed * direction * delta;
  ship.angle = ship.angle % (Math.PI * 2);
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
  
  if (currentTime - game.lastSpeedLine >= 100) {
    game.speedLines.push(new SpeedLine());
    game.lastSpeedLine = currentTime;
    
    game.enemies.push(new Enemy());
  }
  
  update(delta);
  draw();
  
  requestAnimationFrame(gameLoop);
}

// --- Input ---
document.addEventListener('keydown', event => {
  if (['ArrowRight', 'ArrowLeft'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowRight') game.player.turn = -1;
  if (event.key === 'ArrowLeft') game.player.turn = 1;
});

document.addEventListener('keyup', event => {
  if (['ArrowRight', 'ArrowLeft'].includes(event.key)) game.player.turn = 0;
});

// --- Initialization ---
const dpr = window.devicePixelRatio || 1;
html.canvas.width = 800 * dpr;
html.canvas.height = 600 * dpr;
html.canvas.style.width = '800px';
html.canvas.style.height = '600px';
html.ctx.scale(dpr, dpr);

requestAnimationFrame(gameLoop);
