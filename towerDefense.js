// --- Set Up ---
if (!localStorage.getItem('loggedIn') === 'true') {
  window.location.href = 'index.html';
}

// --- Classes ---
class Canvas {
  constructor() {
    this.line = [
      [0, 300], [300, 300], [150, 150],
      [500, 150], [500, 450], [850, 450],
      [700, 300], [1000, 300],
    ];
    this.linePositions = this.getLinePositions();
    this.lineDirections = this.getLineDirections();
  }

  getLinePositions() {
    let lengths = [0];
    for (let i = 1; i < this.line.length; i++) {
      lengths.push(lengths.at(-1) + Math.hypot(this.line[i - 1][0] - this.line[i][0], this.line[i - 1][1] - this.line[i][1]));
    }
    return lengths;
  }

  getLineDirections() {
    let lineDirections = [];
    for (let i = 1; i < this.line.length; i++) {
      let x = this.line[i][0] - this.line[i - 1][0];
      let y = this.line[i][1] - this.line[i - 1][1];
  
      let segment = this.linePositions[i] - this.linePositions[i - 1];
      
      lineDirections.push([x / segment, y / segment]);
    }
    return lineDirections;
  }
  
  draw() {
    html.ctx.strokeStyle = 'rgb(50, 200, 255)';
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
    this.level = 1
    this.type = 'Regular';
    this.damage = 1;
    this.rateOfFire = 3;
    this.range = 70;
    this.cost = 50;
    this.upgrade = {
      damage: 0.5,
      rateOfFire: 0.5,
      range: 5,
      cost: 50,
    };
    this.selected = false;
    this.bullets = [];
    this.lastShot = performance.now();
  }

  draw() {
    html.ctx.fillStyle = 'rgb(150, 0, 255)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();

    for (let bullet of this.bullets) {
      html.ctx.fillStyle = 'rgb(150, 0, 255)';
      html.ctx.beginPath();
      html.ctx.arc(bullet[0], bullet[1], 3, 0, 2 * Math.PI);
      html.ctx.fill();
    }
  }
  
  selectedDraw() {
    html.ctx.fillStyle = 'rgb(255, 255, 255)';
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    html.ctx.fill();
    
    html.ctx.strokeStyle = 'rgb(255, 255, 255)';
    html.ctx.lineWidth = 2;
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
    html.ctx.stroke();
  }

  targetDirection(bullet) {
    let x = bullet[2].x - bullet[0];
    let y = bullet[2].y - bullet[1];
    let distance = Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y);

    return [x / distance, y / distance];
  }
  
  update(delta) {
    if (performance.now() - this.lastShot > 1000 / this.rateOfFire) {
      this.lastShot = performance.now();
      
      let target = 'none';
  
      for (let enemy of game.enemies) {
        if (Math.hypot(this.x - enemy.x, this.y - enemy.y) < this.range) {
          if (target === 'none' || enemy.pos > target.pos) {
            target = enemy;
          }
        }
      }

      if (target !== 'none') { this.bullets.push([this.x, this.y, target]); }
    }

    for (let bullet of this.bullets) {
      if (!game.enemies.includes(bullet[2])) {
        this.bullets = this.bullets.filter(item => item !== bullet);
        return;
      }
      
      let direction = this.targetDirection(bullet);

      bullet[0] += direction[0] * 1000 * delta;
      bullet[1] += direction[1] * 1000 * delta;
      
      if (Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y) <= 8) { 
        bullet[2].health -= this.damage;
        this.bullets = this.bullets.filter(item => item !== bullet);
      }
    }
  }
}

class Sniper {
  constructor(x, y) {
    this.x = x;
    this.y = y
    this.level = 1;
    this.type = 'Sniper';
    this.damage = 5;
    this.rateOfFire = 1;
    this.range = 150;
    this.cost = 100;
    this.upgrade = {
      damage: 1,
      rateOfFire: 0.25,
      range: 10,
      cost: 75,
    };
    this.selected = false;
    this.bullets = [];
    this.lastShot = performance.now();
  }

  draw() {
    html.ctx.fillStyle = 'rgb(0, 0, 255)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();
    
    for (let bullet of this.bullets) {
      html.ctx.fillStyle = 'rgb(0, 0, 255)';
      html.ctx.beginPath();
      html.ctx.arc(bullet[0], bullet[1], 3, 0, 2 * Math.PI);
      html.ctx.fill();
    }
  }
  
  selectedDraw() {
    html.ctx.fillStyle = 'rgb(255, 255, 255)';
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    html.ctx.fill();
    
    html.ctx.strokeStyle = 'rgb(255, 255, 255)';
    html.ctx.lineWidth = 2;
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
    html.ctx.stroke();
  }
  
  targetDirection(bullet) {
    let x = bullet[2].x - bullet[0];
    let y = bullet[2].y - bullet[1];
    let distance = Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y);

    return [x / distance, y / distance];
  }
  
  update(delta) {
    if (performance.now() - this.lastShot > 1000 / this.rateOfFire) {
      this.lastShot = performance.now();
      
      let target = 'none';
  
      for (let enemy of game.enemies) {
        if (Math.hypot(this.x - enemy.x, this.y - enemy.y) < this.range) { target = enemy; break; }
      }

      if (target !== 'none') { this.bullets.push([this.x, this.y, target]); }
    }

    for (let bullet of this.bullets) {
      if (!game.enemies.includes(bullet[2])) {
        this.bullets = this.bullets.filter(item => item !== bullet);
        return;
      }
      
      let direction = this.targetDirection(bullet);

      bullet[0] += direction[0] * 1000 * delta;
      bullet[1] += direction[1] * 1000 * delta;
      
      if (Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y) <= 8) { 
        bullet[2].health -= this.damage;
        this.bullets = this.bullets.filter(item => item !== bullet);
      }
    }
  }
}

class RapidFire {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.type = 'RapidFire';
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
    this.selected = false;
    this.bullets = [];
    this.lastShot = performance.now();
  }

  draw() {
    html.ctx.fillStyle = 'rgb(210, 190, 0)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();
    
    for (let bullet of this.bullets) {
      html.ctx.fillStyle = 'rgb(210, 190, 0)';
      html.ctx.beginPath();
      html.ctx.arc(bullet[0], bullet[1], 3, 0, 2 * Math.PI);
      html.ctx.fill();
    }
  }
  
  selectedDraw() {
    html.ctx.fillStyle = 'rgb(255, 255, 255)';
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    html.ctx.fill();
    
    html.ctx.strokeStyle = 'rgb(255, 255, 255)';
    html.ctx.lineWidth = 2;
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
    html.ctx.stroke();
  }
  
  targetDirection(bullet) {
    let x = bullet[2].x - bullet[0];
    let y = bullet[2].y - bullet[1];
    let distance = Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y);

    return [x / distance, y / distance];
  }
  
  update(delta) {
    if (performance.now() - this.lastShot > 1000 / this.rateOfFire) {
      this.lastShot = performance.now();
      
      let target = 'none';
  
      for (let enemy of game.enemies) {
        if (Math.hypot(this.x - enemy.x, this.y - enemy.y) < this.range) { target = enemy; break; }
      }

      if (target !== 'none') { this.bullets.push([this.x, this.y, target]); }
    }

    for (let bullet of this.bullets) {
      if (!game.enemies.includes(bullet[2])) {
        this.bullets = this.bullets.filter(item => item !== bullet);
        return;
      }
      
      let direction = this.targetDirection(bullet);

      bullet[0] += direction[0] * 1000 * delta;
      bullet[1] += direction[1] * 1000 * delta;
      
      if (Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y) <= 8) { 
        bullet[2].health -= this.damage;
        this.bullets = this.bullets.filter(item => item !== bullet);
      }
    }
  }
}

class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.type = 'Tank';
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
    this.selected = false;
    this.bullets = [];
    this.lastShot = performance.now();
  }

  draw() {
    html.ctx.fillStyle = 'rgb(0, 200, 0)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();
    
    for (let bullet of this.bullets) {
      html.ctx.fillStyle = 'rgb(0, 200, 0)';
      html.ctx.beginPath();
      html.ctx.arc(bullet[0], bullet[1], 3, 0, 2 * Math.PI);
      html.ctx.fill();
    }
  }
  
  selectedDraw() {
    html.ctx.fillStyle = 'rgb(255, 255, 255)';
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    html.ctx.fill();
    
    html.ctx.strokeStyle = 'rgb(255, 255, 255)';
    html.ctx.lineWidth = 2;
    
    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
    html.ctx.stroke();
  }
  
  targetDirection(bullet) {
    let x = bullet[2].x - bullet[0];
    let y = bullet[2].y - bullet[1];
    let distance = Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y);

    return [x / distance, y / distance];
  }
  
  update(delta) {
    if (performance.now() - this.lastShot > 1000 / this.rateOfFire) {
      this.lastShot = performance.now();
      
      let target = 'none';
  
      for (let enemy of game.enemies) {
        if (Math.hypot(this.x - enemy.x, this.y - enemy.y) < this.range) { target = enemy; break; }
      }

      if (target !== 'none') { this.bullets.push([this.x, this.y, target]); }
    }

    for (let bullet of this.bullets) {
      if (!game.enemies.includes(bullet[2])) {
        this.bullets = this.bullets.filter(item => item !== bullet);
        return;
      }
      
      let direction = this.targetDirection(bullet);

      bullet[0] += direction[0] * 1000 * delta;
      bullet[1] += direction[1] * 1000 * delta;
      
      if (Math.hypot(bullet[0] - bullet[2].x, bullet[1] - bullet[2].y) <= 8) { 
        bullet[2].health -= this.damage;
        this.bullets = this.bullets.filter(item => item !== bullet);
      }
    }
  }
}

class EnemyRegular {
  constructor() {
    this.x = game.canvas.line[0][0];
    this.y = game.canvas.line[0][1];
    this.pos = 0;
    this.speed = 95 + (game.wave * 5);
    this.health = 9.5 + (game.wave * 0.5);
    this.maxHealth = this.health;
    this.angle = 0;
  }

  draw() {
    let angle = this.angle * Math.PI / 180;
    
    html.ctx.save();
    html.ctx.translate(this.x, this.y);
    html.ctx.rotate(angle);
    html.ctx.fillStyle = 'rgb(200, 0, 0)';
    html.ctx.fillRect(-8, -8, 16, 16);
    html.ctx.restore();

    html.ctx.strokeStyle = 'rgb(0, 200, 0)';
    html.ctx.lineWidth = 3;
    html.ctx.beginPath();
    html.ctx.moveTo(this.x - 10, this.y - 20);
    html.ctx.lineTo((this.x - 10) + Math.round(20 * this.health / this.maxHealth), this.y - 20);
    html.ctx.stroke();
  }

  update(delta) {
    if (this.health <= 0) {
      game.enemies = game.enemies.filter(item => item !== this);
      game.credits += 25;
      return;
    }
    
    this.pos += this.speed * delta;

    if (this.pos > game.canvas.linePositions.at(-1)) {
      game.lives -= 1;
      game.enemies = game.enemies.filter(item => item !== this);
      return;
    }
    
    let passed = 0;

    for (let i = 0; i < game.canvas.line.length; i++) {
      if (this.pos >= game.canvas.linePositions[i]) {
        passed = i;
      } else {
        break;
      }
    }

    this.x = game.canvas.line[passed][0] + (this.pos - game.canvas.linePositions[passed]) * game.canvas.lineDirections[passed][0];
    this.y = game.canvas.line[passed][1] + (this.pos - game.canvas.linePositions[passed]) * game.canvas.lineDirections[passed][1];

    this.angle += 180 * delta;
  }
}

class EnemySpeed {
  constructor() {
    this.x = game.canvas.line[0][0];
    this.y = game.canvas.line[0][1];
    this.pos = 0;
    this.speed = 145 + (game.wave * 5);
    this.health = 6.5 + (game.wave * 0.5);
    this.maxHealth = this.health;
    this.angle = 0;
  }

  draw() {
    let angle = this.angle * Math.PI / 180;
    
    html.ctx.save();
    html.ctx.translate(this.x, this.y);
    html.ctx.rotate(angle);
    html.ctx.fillStyle = 'rgb(235, 200, 0)';
    html.ctx.beginPath();
    html.ctx.moveTo(0, -10);
    html.ctx.lineTo(10, 7);
    html.ctx.lineTo(-10, 7);
    html.ctx.lineTo(0, -10);
    html.ctx.fill();
    html.ctx.restore();

    html.ctx.strokeStyle = 'rgb(0, 200, 0)';
    html.ctx.lineWidth = 2;
    html.ctx.beginPath();
    html.ctx.moveTo(this.x - 10, this.y - 20);
    html.ctx.lineTo((this.x - 10) + Math.round(20 * this.health / this.maxHealth), this.y - 20);
    html.ctx.stroke();
  }

  update(delta) {
    if (this.health <= 0) {
      game.enemies = game.enemies.filter(item => item !== this);
      game.credits += 25;
      return;
    }
    
    this.pos += this.speed * delta;

    if (this.pos > game.canvas.linePositions.at(-1)) {
      game.lives -= 1;
      game.enemies = game.enemies.filter(item => item !== this);
      return;
    }
    
    let passed = 0;

    for (let i = 0; i < game.canvas.line.length; i++) {
      if (this.pos >= game.canvas.linePositions[i]) {
        passed = i;
      } else {
        break;
      }
    }

    this.x = game.canvas.line[passed][0] + (this.pos - game.canvas.linePositions[passed]) * game.canvas.lineDirections[passed][0];
    this.y = game.canvas.line[passed][1] + (this.pos - game.canvas.linePositions[passed]) * game.canvas.lineDirections[passed][1];

    this.angle += 180 * delta;
  }
}

class EnemyStrong {
  constructor() {
    this.x = game.canvas.line[0][0];
    this.y = game.canvas.line[0][1];
    this.pos = 0;
    this.speed = 45 + (game.wave * 5);
    this.health = 19.5 + (game.wave * 0.5);
    this.maxHealth = this.health;
    this.angle = 0;
  }

  draw() {
    let angle = this.angle * Math.PI / 180;
    
    html.ctx.save();
    html.ctx.translate(this.x, this.y);
    html.ctx.rotate(angle);
    html.ctx.fillStyle = 'rgb(100, 0, 200)';
    html.ctx.beginPath();
    html.ctx.moveTo(0, -9);
    html.ctx.lineTo(10, -1);
    html.ctx.lineTo(6, 10);
    html.ctx.lineTo(-6, 10);
    html.ctx.lineTo(-10, -1);
    html.ctx.lineTo(0, -9);
    html.ctx.fill();
    html.ctx.restore();

    html.ctx.strokeStyle = 'rgb(0, 200, 0)';
    html.ctx.lineWidth = 2;
    html.ctx.beginPath();
    html.ctx.moveTo(this.x - 10, this.y - 20);
    html.ctx.lineTo((this.x - 10) + Math.round(20 * this.health / this.maxHealth), this.y - 20);
    html.ctx.stroke();
  }

  update(delta) {
    if (this.health <= 0) {
      game.enemies = game.enemies.filter(item => item !== this);
      game.credits += 25;
      return;
    }
    
    this.pos += this.speed * delta;

    if (this.pos > game.canvas.linePositions.at(-1)) {
      game.lives -= 1;
      game.enemies = game.enemies.filter(item => item !== this);
      return;
    }

    let passed = 0;

    for (let i = 0; i < game.canvas.line.length; i++) {
      if (this.pos >= game.canvas.linePositions[i]) {
        passed = i;
      } else {
        break;
      }
    }

    this.x = game.canvas.line[passed][0] + (this.pos - game.canvas.linePositions[passed]) * game.canvas.lineDirections[passed][0];
    this.y = game.canvas.line[passed][1] + (this.pos - game.canvas.linePositions[passed]) * game.canvas.lineDirections[passed][1];

    this.angle += 180 * delta;
  }
}

// --- Functions ---
function toggleActive(tower) {
  game.selectedTower.selected = false;
  game.selectedTower = 'none';
  
  html.descriptionSelected.style.display = 'none';
  
  const towers = [
    html.regular,
    html.sniper,
    html.rapidFire,
    html.tank,
  ];
  
  if (tower === 'none') { html.descriptionStandard.style.display = 'none'; return; }
  
  for (let t of towers) {
    if (t.classList.value.includes('active')) t.classList.toggle('active');
  }
                         
  if (html.descriptionStandard.style.display === 'none') { html.descriptionStandard.style.display = 'inline-block'; }
  
  html[tower].classList.toggle('active');
  
  game.activeTower = tower;
  
  draw();
}

function changeDescription(tower) {
  html.typeStandard.textContent = descriptions[tower].type;
  html.damageStandard.textContent = descriptions[tower].damage;
  html.rateOfFireStandard.textContent = descriptions[tower].rateOfFire;
  html.rangeStandard.textContent = descriptions[tower].range;
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
  if (game.selectedTower !== 'none') {
    game.selectedTower.selected = false;
    game.selectedTower = 'none';
  
    html.descriptionSelected.style.display = 'none';
  }
  
  const rect = html.canvas.getBoundingClientRect();
  
  const x = Math.abs(event.clientX - rect.left);
  const y = Math.abs(event.clientY - rect.top);

  let invalidPlacement = false;
  
  for (let t of game.towers) {
    const distance = Math.hypot(t.x - x, t.y - y);
    if (distance < 10) {
      game.selectedTower = t;
      t.selected = true;
      
      const towers = [
        html.regular,
        html.sniper,
        html.rapidFire,
        html.tank,
      ];
      
      for (let t of towers) {
        if (t.classList.value.includes('active')) t.classList.toggle('active');
      }
      
      game.activeTower = 'none';
      html.descriptionStandard.style.display = 'none';
      
      html.descriptionSelected.style.display = 'inline-block';
      
      html.level.textContent = t.level;
      html.typeSelected.textContent = t.type;
      html.damageSelected.textContent = t.damage;
      html.rateOfFireSelected.textContent = t.rateOfFire;
      html.rangeSelected.textContent = t.range;
      html.costSelected.textContent = t.cost;
      
      draw();
      
      return;
    }
    if (distance < 20) {
      invalidPlacement = true;
      break;
    }
  }
  
  if (tower === 'none') return;
  
  for (let i = 0; i < game.canvas.line.length - 1; i++) {
    const x1 = game.canvas.line[i][0];
    const y1 = game.canvas.line[i][1];
    const x2 = game.canvas.line[i + 1][0];
    const y2 = game.canvas.line[i + 1][1];
    
    const distance = distanceToLineSegment(x, y, x1, y1, x2, y2);
    
    if (distance < 20) {
      invalidPlacement = true;
      break;
    }
  }
  
  if (invalidPlacement) {
    html.error.textContent = 'Invalid Tower Placement';
    setTimeout(() => html.error.textContent = '', 2000);
    return;
  } else if (descriptions[game.activeTower].cost > game.credits) {
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
    game.credits -= descriptions[game.activeTower].cost;
  }
  
  draw();
}

function draw() {
  html.ctx.fillStyle = 'rgb(0, 5, 25)';
  html.ctx.fillRect(0, 0, html.canvas.width, html.canvas.height);
  
  game.canvas.draw();

  for (let tower of game.towers) {
    tower.draw();
  }

  for (let enemy of game.enemies) {
    enemy.draw();
  }
  
  if (game.selectedTower !== 'none') game.selectedTower.selectedDraw(); 
 
  html.credits.textContent = game.credits;
  html.wave.textContent = game.wave;
  html.lives.textContent = game.lives;
}

function update(delta) {
  for (let tower of game.towers) {
    tower.update(delta);
  }

  for (let enemy of game.enemies) {
    enemy.update(delta);
  }
}

function start() {
  game.run = true;
  game.lastTime = performance.now();
  game.lastSpawnTime = performance.now() - 1000;
  requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  let delta = (currentTime - game.lastTime) / 1000;
  
  game.lastTime = performance.now();

  if (currentTime - game.lastSpawnTime > 1000 && game.enemiesSpawned < game.wave + 4) {
    game.lastSpawnTime = performance.now();
    game.enemiesSpawned += 1;
    
    let random = Math.round(Math.random() * 5);

    if (random <= 2) {
      switch (game.lastEnemy) {
        case 'regular':
          game.enemies.push(new EnemyRegular());
          break;
        case 'speed':
          game.enemies.push(new EnemySpeed());
          break;
        case 'strong':
          game.enemies.push(new EnemyStrong());
          break;
      }
    } else if (random === 3) {
      game.enemies.push(new EnemyRegular());
      game.lastEnemy = 'regular';
    } else if (random === 4) {
      game.enemies.push(new EnemySpeed());
      game.lastEnemy = 'speed';
    } else {
      game.enemies.push(new EnemyStrong());
      game.lastEnemy = 'strong';
    }
  }
  
  update(delta);
  draw()
  
  if (game.enemiesSpawned >= game.wave + 4 && game.enemies.length === 0) {
    game.run = false;
    game.credits += 100 + game.wave * 25;
    game.wave += 1;
    game.lastEnemy = 'regular';
    game.enemiesSpawned = 0;
    
    update(delta);
    draw();
  }
  
  if (game.run) {
    requestAnimationFrame(gameLoop);
  }
}

// --- Variables ---
let html = {
  canvas: document.getElementById('game'),
  ctx: document.getElementById('game').getContext('2d'),
  
  wave: document.getElementById('wave'),
  credits: document.getElementById('credits'),
  lives: document.getElementById('lives'),
  
  start: document.getElementById('start'),
  
  upgrade: document.getElementById('upgrade'),
  remove: document.getElementById('remove'),
  
  home: document.getElementById('home'), 
  
  regular: document.getElementById('regular'),
  sniper: document.getElementById('sniper'),
  rapidFire: document.getElementById('rapidFire'),
  tank: document.getElementById('tank'),
  
  descriptionStandard: document.getElementById('descriptionStandard'),
  typeStandard: document.getElementById('typeStandard'),
  damageStandard: document.getElementById('damageStandard'),
  rateOfFireStandard: document.getElementById('rateOfFireStandard'),
  rangeStandard: document.getElementById('rangeStandard'),
  costStandard: document.getElementById('costStandard'),
  exitDescriptionStandard: document.getElementById('exitDescriptionStandard'),
  
  descriptionSelected: document.getElementById('descriptionSelected'),
  level: document.getElementById('level'),
  typeSelected: document.getElementById('typeSelected'),
  damageSelected: document.getElementById('damageSelected'),
  rateOfFireSelected: document.getElementById('rateOfFireSelected'),
  rangeSelected: document.getElementById('rangeSelected'),
  costSelected: document.getElementById('costSelected'),
  exitDescriptionSelected: document.getElementById('exitDescriptionSelected'),
  
  error: document.getElementById('error'),
};

let game = {
  credits: 200,
  wave: 1,
  lives: 15,
  
  canvas: new Canvas(),
  
  activeTower: 'regular',
  selectedTower: 'none',
  
  towers: [],
  enemies: [],

  lastTime: 0,
  lastSpawnTime: 0,
  lastEnemy: 'regular',
  enemiesSpawned: 0,
  
  run: false,
};

let descriptions = {
  regular: {
    type: 'Regular',
    damage: 1,
    rateOfFire: 3,
    range: 70,
    cost: 50,
  },
  sniper: {
    type: 'Sniper',
    damage: 5,
    rateOfFire: 1,
    range: 150,
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

html.regular.addEventListener('click', function() { toggleActive('regular'); changeDescription('regular'); });
html.sniper.addEventListener('click', function() { toggleActive('sniper'); changeDescription('sniper'); });
html.rapidFire.addEventListener('click', function() { toggleActive('rapidFire'); changeDescription('rapidFire'); });
html.tank.addEventListener('click', function() { toggleActive('tank'); changeDescription('tank'); });

html.canvas.addEventListener('click', event => placeTower(event, game.activeTower));

html.home.addEventListener('click', function() { window.location.href = 'home'; });

html.exitDescriptionStandard.addEventListener('click', function() { toggleActive('none'); });
html.exitDescriptionSelected.addEventListener('click', function() { toggleActive('none'); });

html.upgrade.addEventListener('click', function() { 
  let tower = game.selectedTower;
  
  if (game.credits >= tower.cost) {
    game.credits -= tower.cost;
  
    tower.damage += tower.upgrade['damage'];
    tower.rateOfFire += tower.upgrade['rateOfFire'];
    tower.range += tower.upgrade['range'];
    tower.cost += tower.upgrade['cost'];
    tower.level += 1;
  
    html.level.textContent = tower.level;
    html.typeSelected.textContent = tower.type;
    html.damageSelected.textContent = tower.damage;
    html.rateOfFireSelected.textContent = tower.rateOfFire;
    html.rangeSelected.textContent = tower.range;
    html.costSelected.textContent = tower.cost;
    
    draw();
  } else {
    html.error.textContent = 'Insufficient Funds';
    setTimeout(() => html.error.textContent = '', 2000);
  }
});

html.remove.addEventListener('click', function() { 
  let tower = game.selectedTower;
  
  game.selectedTower = 'none';
  
  game.towers = game.towers.filter(function(item) {
    return item !== tower;
  });
  
  toggleActive('none');
  
  game.credits += Math.round(tower.cost / 2);
  
  draw();
});

html.start.addEventListener('click', function() {
  if (!game.run) {
    start();
  }
})

// --- Init ---
html.ctx.imageSmoothingEnabled = false;

toggleActive('regular');

// --- Game Loops ---
draw();
