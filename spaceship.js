class Player {
  constructor() {
    this.shots = [];
    this.angle = Math.PI / 2;
    this.speed = 4;
    this.turn = 2;
    this.coolDown = 0.25;
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
}

class SpeedLine {
  constructor(posx, posy, speed) {
    this.pos = {
      x: posx,
      y: posy,
    };
    this.speed = speed;
    this.time = performance.now();
  }
  
  update() {
    if (performance.now() - this.time) {
      game.speedLines = game.speedLines.filter(line => line !== this);
    }
  }
  
  draw() {
    html.ctx.fillStyle = 'rgb(150, 150, 150)';
    html.ctx.fillRect(this.pos);
  }
}

// --- Functions ---
function turn(ship, direction, delta) {
  ship.angle += ship.turn * direction * delta;
}

function update(delta) {
  
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
}

// --- Game Loop ---
gameLoop(currentTime) {
  update();
  draw();
}

// --- Initialization ---
const dpr = window.devicePixelRatio || 1;
html.canvas.width = 800 * dpr;
html.canvas.height = 600 * dpr;
html.canvas.style.width = '800px';
html.canvas.style.height = '600px';
html.ctx.scale(dpr, dpr);

game.player.draw();
