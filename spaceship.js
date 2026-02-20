class Player {
  constructor() {
    this.shots = [];
    this.angle = Math.PI / 2;
    this.speed = 4;
    this.turn = 2;
    this.coolDown = 0.25;
  }
  
  draw() {
    html.ctx.strokeStyle = 'rgb(200, 200, 200)';
    html.ctx.lineWidth = 1;
    html.ctx.beginPath();
    html.ctx.moveTo(game.center.x, game.center.y - 15);
    html.ctx.lineTo(game.center.x + 8, game.center.y + 10);
    html.ctx.lineTo(game.center.x, game.center.y + 5);
    html.ctx.lineTo(game.center.x - 8, game.center.y + 10);
    html.ctx.lineTo(game.center.x, game.center.y - 15);
    html.ctx.stroke();
  }
}

class Enemy {
  constructor (posx, posy, angle) {
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

// --- Functions ---
function turn(ship, direction, delta) {
  ship.angle += ship.turn * direction * delta;
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
}

game.player.draw();
