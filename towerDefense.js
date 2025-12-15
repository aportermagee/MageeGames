// --- Set Up ---
if (!localStorage.getItem('loggedIn') === 'true') {
  window.location.href = 'index.html';
}

// --- Classes ---
class Canvas {
  constructor(line) {
    this.line = line;
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
    this.maxLevel = 5;
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
    this.maxLevel = 5;
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
      rateOfFire: 0.25,
      range: 0.25,
      cost: 75,
    };
    this.maxLevel = 5;
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

class Tank {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.type = 'Tank';
    this.damage = 10;
    this.rateOfFire = 1;
    this.range = 50;
    this.cost = 150;
    this.upgrade = {
      damage: 3,
      rateOfFire: 0.1,
      range: 10,
      cost: 100,
    };
    this.maxLevel = 5;
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

class Laser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.type = 'Laser';
    this.damage = 10;
    this.rateOfFire = '∞';
    this.range = 70;
    this.cost = 250;
    this.upgrade = {
      damage: 5,
      rateOfFire: 0,
      range: 10,
      cost: 250,
    };
    this.maxLevel = 5;
    this.selected = false;
    this.target = 'none';
  }

  draw() {
    html.ctx.fillStyle = 'rgb(0, 200, 255)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();

    if (this.target !== 'none') {
      html.ctx.strokeStyle = 'rgb(0, 200, 255)';
      html.ctx.lineWidth = 1;

      html.ctx.beginPath();
      html.ctx.moveTo(this.x, this.y);
      html.ctx.lineTo(this.target.x, this.target.y);
      html.ctx.stroke();
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
  
  update(delta) {
    let target = 'none';
  
    for (let enemy of game.enemies) {
      if (Math.hypot(this.x - enemy.x, this.y - enemy.y) < this.range) {
        if (target === 'none' || enemy.pos > target.pos) {
          target = enemy;
        }
      }
    }
    
    this.target = target;

    if (target !== 'none') { 
      this.target.health -= this.damage * delta;
    }
  }
}

class Missile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.type = 'Missile';
    this.damage = 8;
    this.rateOfFire = 1;
    this.range = 100;
    this.cost = 200;
    this.blastRadius = 30;
    this.upgrade = {
      damage: 2,
      rateOfFire: 0.3,
      range: 10,
      cost: 150,
    };
    this.maxLevel = 5;
    this.selected = false;
    this.bullets = [];
    this.explosions = [];
    this.lastShot = performance.now();
  }

  draw() {
    html.ctx.fillStyle = 'rgb(200, 0, 0)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();
    
    for (let bullet of this.bullets) {
      html.ctx.fillStyle = 'rgb(200, 0, 0)';
      html.ctx.beginPath();
      html.ctx.arc(bullet[0], bullet[1], 3, 0, 2 * Math.PI);
      html.ctx.fill();
    }

    html.ctx.strokeStyle = 'rgb(200, 0, 0)';
    html.ctx.lineWidth = 2;
    
    for (let explosion of this.explosions) {
      html.ctx.beginPath();
      html.ctx.arc(explosion[0], explosion[1], explosion[2], 0, 2 * Math.PI);
      html.ctx.stroke();
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
    if (!game.run) {
      this.explosions = [];
    }
    
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
        for (let enemy of game.enemies) {
          if (Math.hypot(bullet[0] - enemy.x, bullet[1] - enemy.y) <= this.blastRadius) enemy.health -= this.damage;
        }
        
        this.explosions.push([bullet[2].x, bullet[2].y, 10]);
        this.bullets = this.bullets.filter(item => item !== bullet);
      }
    }

    for (let explosion of this.explosions) {
      explosion[2] += delta * 50;

      if (explosion[2] > this.blastRadius) {
        this.explosions = this.explosions.filter(item => item !== explosion);
      }
    }
  }
}

class Railgun {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.type = 'Railgun';
    this.damage = 15;
    this.rateOfFire = 1;
    this.range = 100;
    this.cost = 200;
    this.upgrade = {
      damage: 5,
      rateOfFire: 0.1,
      range: 10,
      cost: 250,
    };
    this.maxLevel = 5;
    this.selected = false;
    this.bullets = [];
    this.lastShot = performance.now();
  }

  draw() {
    html.ctx.fillStyle = 'rgb(240, 255, 255)';

    html.ctx.beginPath();
    html.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    html.ctx.fill();
    
    html.ctx.strokeStyle = 'rgb(240, 255, 255)';
    html.ctx.lineWidth = 2;
    for (let bullet of this.bullets) {
      html.ctx.beginPath();
      html.ctx.moveTo(this.x, this.y);
      html.ctx.lineTo(bullet[0], bullet[1]);
      html.ctx.stroke();
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
    let x = bullet[3].x - this.x;
    let y = bullet[3].y - this.y;
    let distance = Math.hypot(this.x - bullet[3].x, this.y - bullet[3].y);

    return [x / distance, y / distance];
  }
  
  update(delta) {
    if (!game.run) {
      this.bullets = [];
    }
    
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

      if (target !== 'none') { this.bullets.push([this.x, this.y, 0, target, []]); }
    }

    for (let bullet of this.bullets) {
      let direction = this.targetDirection(bullet);

      bullet[2] += 1000 * delta;

      if (bullet[2] > this.range) {
        this.bullets = this.bullets.filter(item => item !== bullet);
      }
      
      bullet[0] = this.x + direction[0] * bullet[2];
      bullet[1] = this.y + direction[1] * bullet[2];
      
      for (let enemy of game.enemies) {
        if (distanceToLineSegment(enemy.x, enemy.y, this.x, this.y, bullet[0], bullet[1]) < 8 && !bullet[4].includes(enemy)) {
          bullet[4].push(enemy);
          enemy.health -= this.damage;
        }
      }
    }
  }
}

class EnemyRegular {
  constructor() {
    this.x = game.canvas.line[0][0];
    this.y = game.canvas.line[0][1];
    this.pos = 0;
    this.speed = 95 + game.wave * 5;
    this.health = 13 + game.wave * 2;
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
    this.speed = 145 + game.wave * 5;
    this.health = 8 + game.wave * 2;
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
    this.speed = 45 + game.wave * 5;
    this.health =  28 + game.wave * 2;
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
    html.laser,
    html.missile,
    html.railgun,
  ];
  
  if (tower === 'none') { html.descriptionStandard.style.display = 'none'; draw(); return; }
  
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
  html.costStandard.textContent = descriptions[tower].cost;
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
        html.laser,
        html.missile,
        html.railgun,
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
  
  if (tower === 'none') { draw(); return; }
  
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
      case 'laser': game.towers.push(new Laser(x, y)); break;
      case 'missile': game.towers.push(new Missile(x, y)); break;
      case 'railgun': game.towers.push(new Railgun(x, y)); break;
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

  if (currentTime - game.lastSpawnTime > 50 + (1000 - game.wave * 25) && game.enemiesSpawned < game.wave + 4) {
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
  
  if (game.lives <= 0) { 
    game.gameOver = true;
    html.start.textContent = 'Restart';
  }
  if (game.enemiesSpawned >= game.wave + 4 && game.enemies.length === 0 && !game.gameOver) {
    game.run = false;
    game.credits += 100;
    game.wave += 1;
    game.lastEnemy = 'regular';
    game.enemiesSpawned = 0;
    
    update(delta);
    draw();
  }
  
  if (game.run && !game.gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function restart() {
  html.start.textContent = 'Start';
  
  toggleActive('regular');
  
  game = {
    credits: 200,
    wave: 1,
    lives: 15,
    activeTower: 'regular',
    selectedTower: 'none',
    towers: [],
    enemies: [],
    lastTime: 0,
    lastSpawnTime: 0,
    lastEnemy: 'regular',
    enemiesSpawned: 0,
    run: false,
    gameOver: false,
  };
}

function halfMap(map) {
  let halfMap = [];
  
  for (let point of map) {
    halfMap.push([point[0] / 2, point[1] / 2]);
  }
  
  return halfMap;
}

function drawMap(map) {
  let line = halfMap(map);
  
  html.exampleCtx.fillStyle = 'rgb(0, 5, 25)';
  html.exampleCtx.fillRect(0, 0, html.example.width, html.example.height);
  
  html.exampleCtx.strokeStyle = 'rgb(50, 200, 255)';
  html.exampleCtx.lineWidth = 3;
    
  html.exampleCtx.beginPath();
  html.exampleCtx.moveTo(line[0][0], line[0][1]);
  
  for (let i = 1; i < line.length; i++) {
    html.exampleCtx.lineTo(line[i][0], line[i][1]);
  }
  
  html.exampleCtx.stroke();
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
  laser: document.getElementById('laser'),
  missile: document.getElementById('missile'),
  railgun: document.getElementById('railgun'),
  
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
  
  mainPage: document.getElementById('mainPage'),
  mapsPage: document.getElementById('mapsPage'),
  
  fish: document.getElementById('fish'),
  crossRoads: document.getElementById('crossRoads'),
  slants: document.getElementById('slants'),
  labrinth: document.getElementById('labrinth'),
  cubist: document.getElementById('cubist'),
  switchBacks: document.getElementById('switchBacks'),
  
  standard: document.getElementById('standard'),
  diamond: document.getElementById('diamond'),
  tree: document.getElementById('tree'),
  docks: document.getElementById('docks'),
  waves: document.getElementById('waves'),
  skyline: document.getElementById('skyline'),
  
  straightShot: document.getElementById('straightShot'),
  mountains: document.getElementById('mountains'),
  sharkFin: document.getElementById('sharkFin'),
  stocks: document.getElementById('stocks'),
  arrow: document.getElementById('arrow'),
  slipperySlope: document.getElementById('slipperySlope'),
  
  example: document.getElementById('example'),
  exampleCtx: document.getElementById('example').getContext('2d'),
  
  changeMaps: document.getElementById('changeMaps'),
};

let maps = {
  fish: [
    [0, 300], [200, 100], [600, 100], [900, 500], [900, 100], [600, 500],
    [200, 500], [0, 300]
  ],
  crossRoads: [
    [0, 300], [700, 300], [700, 100], [500, 100], [500, 500], [300, 500],
    [300, 100], [500, 100], [500, 500], [700, 500], [700, 300], [1000, 300]
  ],
  slants: [
    [0, 100], [100, 500], [200, 100], [300, 500], [400, 100],
    [500, 500], [600, 100], [700, 500], [800, 100], [900, 500], [1000, 100],
  ],
  labrinth: [
    [0, 300], [550, 300], [550, 250], [400, 250], [400, 200], [600, 200],
    [600, 350], [400, 350], [400, 400], [650, 400], [650, 150], [350, 150],
    [350, 250], [300, 250], [300, 100], [700, 100], [700, 450], [350, 450], 
    [350, 350], [300, 350], [300, 500], [750, 500], [750, 300], [1000, 300]
  ],
  cubist: [
    [0, 100], [700, 200], [500, 100], [200, 400], [100, 300], [500, 200], 
    [600, 500], [1000, 200]
  ],
  switchBacks: [
    [0, 50], [900, 100], [100, 200], [900, 300], [100, 400], [1000, 500]
  ],
  
  standard: [
    [0, 300], [300, 300], [150, 150],
    [500, 150], [500, 450], [850, 450],
    [700, 300], [1000, 300]
  ],
  diamond: [
    [0, 300], [500, 0], [1000, 300], [500, 600], [0, 300]
  ],
  tree: [
    [0, 300], [500, 300], [400, 400], [600, 300], [500, 200],
    [700, 300], [600, 400], [800, 300], [700, 200], [900, 300], 
    [800, 400], [1000, 300]
  ],
  docks: [
    [0, 500], [100, 500], [100, 100], [300, 100], [300, 500],
    [500, 500], [500, 100], [700, 100], [900, 100], [900, 500],
    [1000, 500]
  ],
  waves: [
    [0, 300], [200, 200], [400, 300], [600, 200], [800, 300], [1000, 200]
  ],
  skyline: [
    [0, 500], [200, 500], [200, 200], [400, 200], [400, 400],
    [600, 400], [600, 150], [800, 150], [800, 350], [1000, 350]
  ],
  
  straightShot: [
    [0, 300], [1000, 300]
  ],
  mountains: [
    [0, 500], [200, 300], [400, 400], [600, 100], [800, 500], [1000, 300]
  ],
  sharkFin: [
    [0, 400], [300, 400], [400, 100], [700, 380], [750, 375], [800, 400], [1000, 400]
  ],
  stocks: [
    [0, 300], [200, 200], [300, 400], [400, 150], [600, 450],
    [700, 250], [900, 350], [1000, 300]
  ],
  arrow: [
    [0, 300], [400, 300], [400, 150], [600, 300], [400, 450],
    [400, 300], [1000, 300]
  ],
  slipperySlope: [
    [0, 100], [200, 150], [400, 250], [600, 400], [800, 450], [1000, 500]
  ]
  
};

let game = {
  credits: 200,
  wave: 1,
  lives: 15,
  
  canvas: new Canvas(maps.standard),
  
  activeTower: 'regular',
  selectedTower: 'none',
  
  towers: [],
  enemies: [],

  lastTime: 0,
  lastSpawnTime: 0,
  lastEnemy: 'regular',
  enemiesSpawned: 0,
  
  run: false,
  gameOver: false,
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
  laser: {
    type: 'Laser',
    damage: 10,
    rateOfFire: '∞',
    range: 70,
    cost: 250,
  },
  missile: {
    type: 'Missile',
    damage: 7,
    rateOfFire: 1,
    range: 100,
    cost: 100,
  },
  railgun: {
    type: 'Railgun',
    damage: 15,
    rateOfFire: 1,
    range: 100,
    cost: 200,
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
html.laser.addEventListener('click', function() { toggleActive('laser'); changeDescription('laser'); });
html.missile.addEventListener('click', function() { toggleActive('missile'); changeDescription('missile'); });
html.railgun.addEventListener('click', function() { toggleActive('railgun'); changeDescription('railgun'); });

html.canvas.addEventListener('click', event => placeTower(event, game.activeTower));

html.home.addEventListener('click', function() { window.location.href = 'home'; });

html.exitDescriptionStandard.addEventListener('click', function() { toggleActive('none'); });
html.exitDescriptionSelected.addEventListener('click', function() { toggleActive('none'); });

html.upgrade.addEventListener('click', function() { 
  let tower = game.selectedTower;

  if (tower.level >= tower.maxLevel) {
    html.error.textContent = 'Tower Is At Its Max Level';
    setTimeout(() => html.error.textContent = '', 2000);
    return;
  }
  
  if (game.credits >= tower.cost) {
    game.credits -= tower.cost;
  
    if (tower.upgrade['damage'] !== 0) tower.damage = Math.round((tower.damage + tower.upgrade['damage']) * 10) / 10;
    if (tower.upgrade['rateOfFire'] !== 0) tower.rateOfFire = Math.round((tower.rateOfFire + tower.upgrade['rateOfFire']) * 10) / 10;
    if (tower.upgrade['range'] !== 0) tower.range = Math.round((tower.range + tower.upgrade['range']) * 10) / 10;
    if (tower.upgrade['cost'] !== 0) tower.cost += tower.upgrade['cost'] * tower.level;
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
  if (game.gameOver) {
    restart();
    draw();
    return;
  }
  if (!game.run) {
    start();
  }
});

html.fish.addEventListener('mouseover', () => drawMap(maps.fish));
html.fish.addEventListener('click', function() {
  game.canvas = new Canvas(maps.fish);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.crossRoads.addEventListener('mouseover', () => drawMap(maps.crossRoads));
html.crossRoads.addEventListener('click', function() {
  game.canvas = new Canvas(maps.crossRoads);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.slants.addEventListener('mouseover', () => drawMap(maps.slants));
html.slants.addEventListener('click', function() {
  game.canvas = new Canvas(maps.slants);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.labrinth.addEventListener('mouseover', () => drawMap(maps.labrinth));
html.labrinth.addEventListener('click', function() {
  game.canvas = new Canvas(maps.labrinth);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.cubist.addEventListener('mouseover', () => drawMap(maps.cubist));
html.cubist.addEventListener('click', function() {
  game.canvas = new Canvas(maps.cubist);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.switchBacks.addEventListener('mouseover', () => drawMap(maps.switchBacks));
html.switchBacks.addEventListener('click', function() {
  game.canvas = new Canvas(maps.switchBacks);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.standard.addEventListener('mouseover', () => drawMap(maps.standard));
html.standard.addEventListener('click', function() {
  game.canvas = new Canvas(maps.standard);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.diamond.addEventListener('mouseover', () => drawMap(maps.diamond));
html.diamond.addEventListener('click', function() {
  game.canvas = new Canvas(maps.diamond);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.tree.addEventListener('mouseover', () => drawMap(maps.tree));
html.tree.addEventListener('click', function() {
  game.canvas = new Canvas(maps.tree);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.docks.addEventListener('mouseover', () => drawMap(maps.docks));
html.docks.addEventListener('click', function() {
  game.canvas = new Canvas(maps.docks);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.waves.addEventListener('mouseover', () => drawMap(maps.waves));
html.waves.addEventListener('click', function() {
  game.canvas = new Canvas(maps.waves);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.skyline.addEventListener('mouseover', () => drawMap(maps.skyline));
html.skyline.addEventListener('click', function() {
  game.canvas = new Canvas(maps.skyline);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.straightShot.addEventListener('mouseover', () => drawMap(maps.straightShot));
html.straightShot.addEventListener('click', function() {
  game.canvas = new Canvas(maps.straightShot);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.mountains.addEventListener('mouseover', () => drawMap(maps.mountains));
html.mountains.addEventListener('click', function() {
  game.canvas = new Canvas(maps.mountains);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.sharkFin.addEventListener('mouseover', () => drawMap(maps.sharkFin));
html.sharkFin.addEventListener('click', function() {
  game.canvas = new Canvas(maps.sharkFin);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.stocks.addEventListener('mouseover', () => drawMap(maps.stocks));
html.stocks.addEventListener('click', function() {
  game.canvas = new Canvas(maps.stocks);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.arrow.addEventListener('mouseover', () => drawMap(maps.arrow));
html.arrow.addEventListener('click', function() {
  game.canvas = new Canvas(maps.arrow);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.slipperySlope.addEventListener('mouseover', () => drawMap(maps.slipperySlope));
html.slipperySlope.addEventListener('click', function() {
  game.canvas = new Canvas(maps.slipperySlope);
  html.mapsPage.style.display = 'none';
  html.mainPage.style.display = 'block';
  draw();
});

html.changeMaps.addEventListener('click', function() {
  restart();
  draw();
  html.mainPage.style.display = 'none';
  html.mapsPage.style.display = 'block';
});

// --- Init ---
html.ctx.imageSmoothingEnabled = false;

toggleActive('regular');

// --- Game Loops ---
draw();
