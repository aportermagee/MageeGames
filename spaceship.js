class Player {
  constructor() {
    this.pos = {
      x: Math.round(html.canvas.width / 2),
      y: Math.round(html.canvas.height / 2),
    };
    this.shots = [];
    this.angle = Math.PI / 2;
    this.speed = 300;
    this.turnSpeed = 2;
    this.turn = 0;
    this.coolDown = 0.25;
  }
  
  update(dt) {
    if (this.turn !== 0) {
      for (let enemy of game.enemies) {
        let ta = this.turnSpeed * this.turn * dt;
    
        let dx = enemy.pos.x - this.pos.x;
        let dy = enemy.pos.y - this.pos.y;

        let cos = Math.cos(ta);
        let sin = Math.sin(ta);

        enemy.pos.x = this.pos.x + dx * cos - dy * sin;
        enemy.pos.y = this.pos.y + dx * sin + dy * cos;
        
        enemy.angle += ta;
        enemy.angle = enemy.angle % (Math.PI * 2);
      }
      
      for (let line of game.speedLines) {
        line.pos.x += this.turn * dt * 200;
      }
      
      turn(this, this.turn, dt);
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
    
    html.ctx.fillStyle = 'rgb(0, 10, 30)';
    html.ctx.beginPath();
    html.ctx.arc(110, 105, 75, 0, Math.PI * 2);
    html.ctx.fill();
    
    html.ctx.fillStyle = 'rgb(0, 0, 0)';
    html.ctx.beginPath();
    html.ctx.arc(110, 105, 25, 0, Math.PI * 2);
    html.ctx.fill();
    
    html.ctx.font = 'bold 20px Tahoma';
    html.ctx.textAlign = 'center';
    html.ctx.fillStyle = 'rgb(200, 50, 50)';
    html.ctx.fillText('N', 110 + Math.cos(this.angle + Math.PI) * 50, 110 + Math.sin(this.angle + Math.PI) * 50);
    html.ctx.fillStyle = 'rgb(200, 200, 200)';
    html.ctx.fillText('W', 110 + Math.cos(this.angle + Math.PI / 2) * 50, 110 + Math.sin(this.angle + Math.PI / 2) * 50);
    html.ctx.fillText('S', 110 + Math.cos(this.angle) * 50, 110 + Math.sin(this.angle) * 50);
    html.ctx.fillText('E', 110 + Math.cos(this.angle + Math.PI * 3 / 2) * 50, 110 + Math.sin(this.angle + Math.PI * 3 / 2) * 50);
    
    html.ctx.lineWidth = 2;
    html.ctx.strokeStyle = 'rgb(200, 200, 200)';
    html.ctx.beginPath();
    html.ctx.arc(110, 105, 25, 0, Math.PI * 2);
    html.ctx.stroke();
    
    html.ctx.strokeStyle = 'rgb(200, 200, 200)';
    html.ctx.beginPath();
    html.ctx.arc(110, 105, 75, 0, Math.PI * 2);
    html.ctx.stroke();
  }
}

class Enemy {
  constructor() {
    this.pos = {
      x: Math.round(Math.random() * html.canvas.width * 2) - html.canvas.width / 2,
      y: Math.round(Math.random() * html.canvas.height * 2) - html.canvas.height / 2,
    };
    this.angle = Math.round(Math.random() * Math.PI * 2);
    this.turnSpeed = Math.random() + 1;
    this.shots = [];
    this.speed = Math.round(Math.random() * 50) + 275;
    this.coolDown = 0.5;
  }
  
  update(dt) {
    this.pos.x += Math.cos(this.angle) * this.speed * dt;
    this.pos.y += (Math.sin(this.angle) * this.speed + game.player.speed) * dt;

    if (this.pos.x < -100) this.pos.x = 850;
    if (this.pos.x > 900) this.pos.x = -50;
    if (this.pos.y < -100) this.pos.y = 650;
    if (this.pos.y > 700) this.pos.y = -50;
    
    let dx = game.player.pos.x - this.pos.x;
    let dy = game.player.pos.y - this.pos.y;
    let targetAngle = Math.atan2(dy, dx);
    
    let angleDiff = targetAngle - this.angle;
    angleDiff = ((angleDiff - Math.PI) % (Math.PI * 2)) + Math.PI;
    
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
  
  update(dt) {
    if (performance.now() - this.time >= 1000) {
      game.speedLines = game.speedLines.filter(line => line !== this);
    }
    
    this.pos.y += dt * 5 * this.speed;
  }
  
  draw() {
    html.ctx.fillStyle = 'rgb(150, 150, 150)';
    html.ctx.fillRect(this.pos.x, this.pos.y, 1, this.length);
  }
}

// --- Functions ---
function turn(ship, direction, dt) {
  ship.angle += ship.turnSpeed * direction * dt;
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
  lastEnemy: performance.now(),
}

// --- Game Loop ---
function gameLoop(currentTime) {
  let delta = (currentTime - game.lastTime) / 1000;
  game.lastTime = currentTime;
  
  if (currentTime - game.lastSpeedLine >= 250) {
    game.speedLines.push(new SpeedLine());
    game.lastSpeedLine = currentTime;
  } 
  
  if (currentTime - game.lastEnemy >= 20000) {
    game.enemies.push(new Enemy());
    game.lastEnemy = currentTime;
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

game.enemies.push(new Enemy());
requestAnimationFrame(gameLoop);
