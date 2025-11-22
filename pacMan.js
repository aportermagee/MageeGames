// --- Return User To Login Page ---
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

// --- Initialize Supabase ---
const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- High Score ---
let highScore;

async function getHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .select('highScorePacMan')
    .eq('id', JSON.parse(localStorage.getItem('user')).id)
    .single();

  if (error) {
    console.error(error);
  } else {
    highScore = data.highScorePacMan;
  }
}

getHighScore().then(function() {
  document.getElementById('score').textContent = 'Score: 0 | High Score: ' + highScore;
});

async function updateHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .update({ highScorePacMan: highScore })
    .eq('id', JSON.parse(localStorage.getItem('user')).id);

  if (error) {
    console.error(error);
  }
}

// --- Ghost Class ---
class Ghost {
  constructor(name, x, y, color, timer, corner) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.eyeColor = 'rgb(0, 0, 0)';
    this.color = color;
    this.originalColor = color;
    this.direction = 'right';
    this.free = false;
    this.timer = timer;
    this.startTime = performance.now() / 1000;
    this.currentTime;
    this.speed = 2;
    this.corner = corner;
    this.last = 'left';
  }

  moveUp() {
    switch (this.direction) {
      case 'right':
        if (maze.layout[this.y - 1][Math.round(this.x)] !== 1 && Math.ceil(this.x) === Math.floor(this.x + 0.2)) {
          this.x = Math.round(this.x);
          this.direction = 'up';
        }
        break;
      case 'left':
        if (maze.layout[this.y - 1][Math.round(this.x)] !== 1 && Math.floor(this.x) === Math.ceil(this.x - 0.2)) {
          this.x = Math.round(this.x);
          this.direction = 'up';
        }
        break;
      case 'down':
        this.direction = 'up';
        break;
    }
  }

  moveDown() {
    switch (this.direction) {
      case 'right':
        if (![1, 3].includes(maze.layout[this.y + 1][Math.round(this.x)]) && Math.ceil(this.x) === Math.floor(this.x + 0.2)) {
          this.x = Math.round(this.x);
          this.direction = 'down';
        }
        break;
      case 'left':
        if (![1, 3].includes(maze.layout[this.y + 1][Math.round(this.x)]) && Math.floor(this.x) === Math.ceil(this.x - 0.2)) {
          this.x = Math.round(this.x);
          this.direction = 'down';
        }
        break;
      case 'up':
        this.direction = 'down';
        break;
    }
  }

  moveRight() {
    switch (this.direction) {
      case 'up':
        if (maze.layout[Math.round(this.y)][this.x + 1] !== 1 && Math.floor(this.y) === Math.ceil(this.y - 0.2)) {
          this.y = Math.round(this.y);
          this.direction = 'right';
        }
        break;
      case 'down':
        if (maze.layout[Math.round(this.y)][this.x + 1] !== 1 && Math.ceil(this.y) === Math.floor(this.y + 0.2)) {
          this.y = Math.round(this.y);
          this.direction = 'right';
        }
        break;
      case 'left':
        this.direction = 'right';
        break;
    }
  }

  moveLeft() {
    switch (this.direction) {
      case 'up':
        if (maze.layout[Math.round(this.y)][this.x - 1] !== 1 && Math.floor(this.y) === Math.ceil(this.y - 0.2)) {
          this.y = Math.round(this.y);
          this.direction = 'left';
        }
        break;
      case 'down':
        if (maze.layout[Math.round(this.y)][this.x - 1] !== 1 && Math.ceil(this.y) === Math.floor(this.y + 0.2)) {
          this.y = Math.round(this.y);
          this.direction = 'left';
        }
        break;
      case 'right':
        this.direction = 'left';
        break;
    }
  }

  minMove(pos, row1, row2, r) {
    let best = Infinity;
    switch (r) {
      case 0:
        if (best === Infinity) {
          for (let i = pos + 1; i < row1.length; i++) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) {
          for (let i = pos - 1; i >= 0; i--) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) {
          if (![1, 3].includes(row1[pos])) {
            best = pos;
          }
        }
        if (best === Infinity) return 2;
      case 1:
        if (best === Infinity) {
          if (![1, 3].includes(row1[pos])) {
            best = pos;
          }
        }
        if (best === Infinity) {
          for (let i = pos - 1; i >= 0; i--) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) {
          for (let i = pos + 1; i < row1.length; i++) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) return 2;
      case -1:
        if (best === Infinity) {
          if (![1, 3].includes(row1[pos])) {
            best = pos;
          }
        }
        if (best === Infinity) {
          for (let i = pos + 1; i < row1.length; i++) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) {
          for (let i = pos - 1; i >= 0; i--) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) return 2;
      case 2:
        if (![1, 3].includes(row1[pos])) {
          best = pos;
        }
        if (best === Infinity) {
          for (let i = pos + 1; i < row1.length; i++) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) {
          for (let i = pos - 1; i >= 0; i--) {
            if ((![1, 3].includes(row1[i])) && Math.abs(pos - i) < Math.abs(pos - best)) {
              if (!row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(1) && !row2.slice(Math.min(pos, i), Math.max(pos, i) + 1).includes(3)) {
                best = i;
              }
            }
          }
        }
        if (best === Infinity) return 2;
    }

    if (pos === best) return 0;
    if (best > pos) return 1;
    return -1;
  }
  
  findPath(pos, best, target) {
    let row1 = [];
    let row2 = [];
    let r;
    let reverseR = false;
    let p;
    
    switch (best) {
      case 'right':
        for (let c = 0; c < maze.layout.length; c++) {
          row1.push(maze.layout[c][pos[0] + 1]);
          row2.push(maze.layout[c][pos[0]]);
        }
        p = pos[1];
        if (target[1] < pos[1]) {
          p = 19 - p;
          row1.reverse();
          row2.reverse();
          reverseR = true;
        }
        
        if (this.last === 'right') r = 0;
        if (this.last === 'down') r = 1;
        if (this.last === 'up') r = -1;
        if (this.last === 'left') r = 2;
        if (reverseR && r !== 2) r = r * -1; 
        
        r = this.minMove(p, row1, row2, r);
        
        if (reverseR) r = r * -1;
        if (r === 0) return 'right';
        if (r === 1) return 'down';
        if (r === -1) return 'up';
        return 'left';
      case 'left':
        for (let c = 0; c < maze.layout.length; c++) {
          row1.push(maze.layout[c][pos[0] - 1]);
          row2.push(maze.layout[c][pos[0]]);
        }
        p = pos[1];
        if (target[1] < pos[1]) {
          p = 19 - p;
          row1.reverse();
          row2.reverse();
          reverseR = true;
        }
        
        if (this.last === 'left') r = 0;
        if (this.last === 'down') r = 1;
        if (this.last === 'up') r = -1;
        if (this.last === 'right') r = 2;
        if (reverseR && r !== 2) r = r * -1; 
        
        r = this.minMove(p, row1, row2, r);
        
        if (reverseR) r = r * -1;
        if (r === 0) return 'left';
        if (r === 1) return 'down';
        if (r === -1) return 'up';
        return 'right';
      case 'up':
        row1 = [...maze.layout[pos[1] - 1]];
        row2 = [...maze.layout[pos[1]]];
        p = pos[0];
        if (target[0] < pos[0]) {
          p = 19 - p;
          row1.reverse();
          row2.reverse();
          reverseR = true;
        }
        
        if (this.last === 'up') r = 0;
        if (this.last === 'right') r = 1;
        if (this.last === 'left') r = -1;
        if (this.last === 'down') r = 2;
        if (reverseR && r !== 2) r = r * -1; 
        
        r = this.minMove(p, row1, row2, r);
        
        if (reverseR) r = r * -1;
        if (r === 0) return 'up';
        if (r === 1) return 'right';
        if (r === -1) return 'left';
        return 'down';
      case 'down':
        row1 = [...maze.layout[pos[1] + 1]];
        row2 = [...maze.layout[pos[1]]];
        p = pos[0];
        if (target[0] < pos[0]) {
          p = 19 - p;
          row1.reverse();
          row2.reverse();
          reverseR = true;
        }
        
        if (this.last === 'down') r = 0;
        if (this.last === 'right') r = 1;
        if (this.last === 'left') r = -1;
        if (this.last === 'up') r = 2;
        if (reverseR && r !== 2) r = r * -1; 
        
        r = this.minMove(p, row1, row2, r);
        
        if (reverseR) r = r * -1;
        if (r === 0) return 'down';
        if (r === 1) return 'right';
        if (r === -1) return 'left';
        return 'up';
    }
  }

  pursue(target, delta) {
    let directions = {
      'right': [1, 0],
      'left': [-1, 0],
      'up': [0, -1],
      'down': [0, 1]
    };
    let best = Infinity;
    let direction;
    for (const key in directions) {
      if (Math.hypot((this.x + directions[key][0]) - target[0], (this.y + directions[key][1]) - target[1]) < best) {
        best = Math.hypot((this.x + directions[key][0]) - target[0], (this.y + directions[key][1]) - target[1]);
        direction = key;
      }
    }

    direction = this.findPath([Math.round(this.x), Math.round(this.y)], direction, target);
    let dir = this.direction;
    
    if (this.direction !== direction) {
      switch (direction) {
        case 'right':
          this.moveRight();
          break;
        case 'left':
          this.moveLeft();
          break;
        case 'up': 
          this.moveUp();
          break;
        case 'down': 
          this.moveDown();
          break;
      }

      if (this.direction === direction) {
        this.last = dir;
      }
    }

    this.x += directions[this.direction][0] * this.speed * delta;
    this.y += directions[this.direction][1] * this.speed * delta;    
  }
  
  update(delta) {
    if (semiScared) {
      this.color = 'rgb(255, 255, 255)';
    } else if (scared) {
      this.color = 'rgb(0, 0, 255)';
      this.eyeColor = 'rgb(0, 0, 255)';
    } else {
      this.color = this.originalColor;
      this.eyeColor = 'rgb(0, 0, 0)';
    }
    
    this.currentTime = performance.now() / 1000;
    if (!this.free && (this.currentTime - this.startTime) > this.timer) {
      this.y -= delta * this.speed;
      if (maze.layout[Math.floor(this.y)][this.x] === 1) {
        this.y = Math.ceil(this.y);
        this.free = true;
        this.direction = 'right';
      }
    }
    
    if (this.free) {
      let directions = {
        'right': [1, 0],
        'left': [-1, 0],
        'up': [0, -1],
        'down': [0, 1],
      };

      let blueTargeting = (Math.hypot(this.x - pacMan.x, this.y - pacMan.y) > 4) ? directions[pacMan.direction].map(num => num * 3) : [0, 0];
      let pinkTargeting = (Math.hypot(this.x - pacMan.x, this.y - pacMan.y) > 3) ? directions[pacMan.direction].map(num => num * -2) : [0, 0];
      let orangeTargeting = (Math.hypot(this.x - pacMan.x, this.y - pacMan.y) > 7) ? directions[pacMan.direction].map(num => num * 5) : [0, 0];
      
      let targeting = {
        'red': [0, 0],
        'blue': blueTargeting,
        'pink': pinkTargeting,
        'orange': orangeTargeting,
      };

      if (scared) {
        this.pursue(this.corner, delta);
      } else {
        this.pursue([pacMan.x + targeting[this.name][0], pacMan.y + targeting[this.name][1]], delta);
      }

      switch (this.direction) {
        case 'right':
          if ([1, 3].includes(maze.layout[this.y][Math.ceil(this.x)])) {
            this.x = Math.floor(this.x);
          }
          break;
        case 'left':
          if ([1, 3].includes(maze.layout[this.y][Math.floor(this.x)])) {
            this.x = Math.ceil(this.x);
          }
          break;
        case 'up':
          if ([1, 3].includes(maze.layout[Math.floor(this.y)][this.x])) {
            this.y = Math.ceil(this.y);
          }
          break;
        case 'down':
          if ([1, 3].includes(maze.layout[Math.ceil(this.y)][this.x])) {
            this.y = Math.floor(this.y);
          }
          break;
      }
      if (this.x < -1) {
        this.x = 19.95;
      }
      if (this.x > 19.95) {
        this.x = -0.95;
      }
    }
  }
  
  draw() {
    let eyeX = (pacMan.x > this.x) ? 1 : -1;
    eyeX = (pacMan.x === this.x) ? 0 : eyeX;
    let eyeY = (pacMan.y > this.y) ? 3 : 1;
    eyeY = (pacMan.y === this.y) ? 2 : eyeY;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x * box + Math.floor(box / 2), this.y * box + Math.floor(box / 2), Math.floor(box / 2), Math.PI, 0, false);
    ctx.lineTo(this.x * box + box, this.y * box + box);
    ctx.lineTo(this.x * box + Math.round(box * 3 / 4), this.y * box + Math.round(box * 5 / 6));
    ctx.lineTo(this.x * box + Math.round(box / 2), this.y * box + box);
    ctx.lineTo(this.x * box + Math.round(box / 4), this.y * box + Math.round(box * 5 / 6));
    ctx.lineTo(this.x * box, this.y * box + box);
    ctx.lineTo(this.x * box, this.y * box + Math.round(box / 2));
    ctx.fill();

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(this.x * box + Math.floor(box / 3) - 1, this.y * box + Math.round(box / 3), 4, 6);
    ctx.fillRect(this.x * box + Math.floor(box * 2 / 3) - 1, this.y * box + Math.round(box / 3), 4, 6);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(this.x * box + Math.floor(box / 3) + eyeX, this.y * box + Math.round(box / 3) + eyeY, 2, 3);
    ctx.fillRect(this.x * box + Math.floor(box * 2 / 3) + eyeX, this.y * box + Math.round(box / 3) + eyeY, 2, 3);
  }
}

// --- Pac-Man Class ---
class PacMan {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.color = 'rgb(255, 255, 0)';
    this.mouth = 0.2;
    this.direction = 'right';
    this.mouthDirection = 1;
    this.lastTime = performance.now();
    this.currentTime;
  }

  moveUp() {
    switch (this.direction) {
      case 'right':
        if (maze.layout[this.y - 1][Math.round(this.x)] !== 1 && Math.ceil(this.x) === Math.floor(this.x + 0.5)) {
          this.x = Math.round(this.x);
          this.direction = 'up';
        }
        break;
      case 'left':
        if (maze.layout[this.y - 1][Math.round(this.x)] !== 1 && Math.floor(this.x) === Math.ceil(this.x - 0.5)) {
          this.x = Math.round(this.x);
          this.direction = 'up';
        }
        break;
      case 'down':
        this.direction = 'up';
        break;
    }
  }

  moveDown() {
    switch (this.direction) {
      case 'right':
        if (![1, 3].includes(maze.layout[this.y + 1][Math.round(this.x)]) && Math.ceil(this.x) === Math.floor(this.x + 0.5)) {
          this.x = Math.round(this.x);
          this.direction = 'down';
        }
        break;
      case 'left':
        if (![1, 3].includes(maze.layout[this.y + 1][Math.round(this.x)]) && Math.floor(this.x) === Math.ceil(this.x - 0.5)) {
          this.x = Math.round(this.x);
          this.direction = 'down';
        }
        break;
      case 'up':
        this.direction = 'down';
        break;
    }
  }

  moveRight() {
    switch (this.direction) {
      case 'up':
        if (maze.layout[Math.round(this.y)][this.x + 1] !== 1 && Math.floor(this.y) === Math.ceil(this.y - 0.5)) {
          this.y = Math.round(this.y);
          this.direction = 'right';
        }
        break;
      case 'down':
        if (maze.layout[Math.round(this.y)][this.x + 1] !== 1 && Math.ceil(this.y) === Math.floor(this.y + 0.5)) {
          this.y = Math.round(this.y);
          this.direction = 'right';
        }
        break;
      case 'left':
        this.direction = 'right';
        break;
    }
  }

  moveLeft() {
    switch (this.direction) {
      case 'up':
        if (maze.layout[Math.round(this.y)][this.x - 1] !== 1 && Math.floor(this.y) === Math.ceil(this.y - 0.5)) {
          this.y = Math.round(this.y);
          this.direction = 'left';
        }
        break;
      case 'down':
        if (maze.layout[Math.round(this.y)][this.x - 1] !== 1 && Math.ceil(this.y) === Math.floor(this.y + 0.5)) {
          this.y = Math.round(this.y);
          this.direction = 'left';
        }
        break;
      case 'right':
        this.direction = 'left';
        break;
    }
  }

  update(delta) {
    this.currentTime = performance.now();
    if (this.currentTime - this.lastTime > 20) {
      this.lastTime = this.currentTime;
      this.mouth += 0.05 * this.mouthDirection;
      
      if (this.mouth >= 0.3 || this.mouth <= 0.05) {
          this.mouthDirection *= -1;
      }
    }
    
    let direction = {
      'right': [1, 0],
      'left': [-1, 0],
      'up': [0, -1],
      'down': [0, 1]
    };

    this.x += direction[this.direction][0] * delta * speed;
    this.y += direction[this.direction][1] * delta * speed;
    
    switch (this.direction) {
      case 'right':
        if ([1, 3].includes(maze.layout[this.y][Math.ceil(this.x)])) {
          this.x = Math.floor(this.x);
        }
        break;
      case 'left':
        if ([1, 3].includes(maze.layout[this.y][Math.floor(this.x)])) {
          this.x = Math.ceil(this.x);
        }
        break;
      case 'up':
        if ([1, 3].includes(maze.layout[Math.floor(this.y)][this.x])) {
          this.y = Math.ceil(this.y);
        }
        break;
      case 'down':
        if ([1, 3].includes(maze.layout[Math.ceil(this.y)][this.x])) {
          this.y = Math.floor(this.y);
        }
        break;
    }
    if (this.x < -1) {
      this.x = 19.95;
    }
    if (this.x > 19.95) {
      this.x = -0.95;
    }

    switch (maze.layout[Math.round(this.y)][Math.round(this.x)]) {
      case 0:
        score += 5;
        maze.layout[Math.round(this.y)][Math.round(this.x)] = 4;
        if (checkForDots() === false) round += 1; round();
        break;
      case 2:
        score += 25;
        maze.layout[Math.round(this.y)][Math.round(this.x)] = 4;
        scared = true;
        scaredTime = this.currentTime;
        if (checkForDots() === false) r += 1; round();
        break;
    }
  }
  
  draw() {
    ctx.fillStyle = this.color;
    let centerX = this.x * box + box / 2;
    let centerY = this.y * box + box / 2;
    let radius = box / 2;
    let startAngle, endAngle;
    const mouthSize = this.mouth * Math.PI;
    const directions = {
      right: 0,
      down: 0.5 * Math.PI,
      left: Math.PI,
      up: 1.5 * Math.PI
    };
    startAngle = directions[this.direction] + mouthSize;
    endAngle = directions[this.direction] - mouthSize; 
    if (startAngle === endAngle) {
        startAngle = 0;
        endAngle = Math.PI * 2;
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
  }
}

// --- Maze Class ---
class Maze {
  constructor() {
    this.rows = canvas.width / box;
    this.columns = canvas.height / box;
    this.layout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 3, 3, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 4, 4, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4],   
      [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],    
    ];
    this.originalLayout = this.layout.map(row => [...row]);
  }

  draw() {
    for (let y = 0; y < this.columns; y++) {
      for(let x = 0; x < this.rows; x++) {
        switch (this.layout[y][x]) {
          case 0:
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            ctx.arc(x * box + box / 2, y * box + box / 2, Math.floor(box / 6), 0, Math.PI * 2, false);
            ctx.fill();
            break;
          case 1:
            ctx.fillStyle = 'rgb(0, 0, 120)';
            ctx.fillRect(x * box, y * box, box, box);
                
            ctx.strokeStyle = 'rgb(0, 0, 130)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x * box + 1, y * box + 1, box - 2, box - 2);
            break;
          case 2:
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            ctx.arc(x * box + box / 2, y * box + box / 2, Math.floor(box / 3), 0, Math.PI * 2, false);
            ctx.fill();
            break;
          case 3:
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(x * box, y * box, box, 4);
            break;
        }
      }
    }
  }
}

// --- Set Up ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const box = 26;
const speed = 3;
const scoreP = document.getElementById('score');
const scareTime = 10;

let score = 0;
let run = false;
let pause = false;
let lastTime;
let scared = false;
let semiScared = false;
let scaredTime;
let lastSemiScared = performance.now();
let lives = 3;
let r = 1;

const red = new Ghost('red', 9, 6, 'rgb(255, 0, 0)', 0, [1, 1]);
const blue = new Ghost('blue', 10, 6, 'rgb(0, 200, 250)', 3, [18, 1]);
const pink = new Ghost('pink', 9, 7, 'rgb(255, 150, 255)', 6, [18, 18]);
const orange = new Ghost('orange', 10, 7, 'rgb(255, 130, 0)', 9, [1, 18]);
const pacMan = new PacMan(9, 18);
const maze = new Maze();

function collision(a, b) {
  if (Math.round(a.x) === Math.round(b.x) && Math.round(a.y) === Math.round(b.y)) return true;
  return false;
}

function draw() {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    maze.draw();
    
    red.draw();
    blue.draw();
    pink.draw();
    orange.draw();
    pacMan.draw();
}

function update(delta, currentTime) {
  if (scared === true) {
    if ((currentTime - scaredTime) / 1000 > scareTime) {
      scared = false;
      semiScared = false;
    } else if ((currentTime - scaredTime) / 1000 > 5 && (currentTime - lastSemiScared) / 1000 > 1) {
      lastSemiScared = currentTime;
      semiScared = (semiScared) ? false : true;
    }

    red.update(delta);
    if (collision(red, pacMan)) red.x = red.originalX; red.y = red.originalY;
    blue.update(delta);
    if (collision(blue, pacMan)) blue.x = blue.originalX; blue.y = blue.originalY;
    orange.update(delta);
    if (collision(orange, pacMan)) orange.x = orange.originalX; orange.y = orange.originalY;
    pink.update(delta);
    if (collision(pink, pacMan)) pink.x = pink.originalX; pink.y = pink.originalY;
    
    pacMan.update(delta);
    if (collision(red, pacMan)) red.x = red.originalX; red.y = red.originalY;
    if (collision(blue, pacMan)) blue.x = blue.originalX; blue.y = blue.originalY;
    if (collision(orange, pacMan)) orange.x = orange.originalX; orange.y = orange.originalY;
    if (collision(pink, pacMan)) pink.x = pink.originalX; pink.y = pink.originalY;
  } else {
    red.update(delta);
    if (collision(red, pacMan)) lives -= 1; round();
    blue.update(delta);
    if (collision(blue, pacMan)) lives -= 1; round();
    orange.update(delta);
    if (collision(orange, pacMan)) lives -= 1; round();
    pink.update(delta);
    if (collision(pink, pacMan)) lives -= 1; round();
    
    pacMan.update(delta);
    if (collision(red, pacMan)) lives -= 1; round();
    if (collision(blue, pacMan)) lives -= 1; round();
    if (collision(orange, pacMan)) lives -= 1; round();
    if (collision(pink, pacMan)) lives -= 1; round();
  }
  
  scoreP.textContent = 'Score: ' + score + ' | High Score: ' + highScore + ' | Round: ' + r;
}

function resume() {
  run = true;
  pause = false;
  
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function start() {
  run = true;
  pause = false;
  score = 0;
  scared = false;
  
  red.x = red.originalX;
  red.y = red.originalY;
  red.direction = 'right';
  red.free = false;
  red.startTime = performance.now() / 1000;  
  blue.x = blue.originalX;
  blue.y = blue.originalY;
  blue.direction = 'right';
  blue.free = false;
  blue.startTime = performance.now() / 1000;
  pink.x = pink.originalX;
  pink.y = pink.originalY;
  pink.direction = 'right';
  pink.free = false;
  pink.startTime = performance.now() / 1000;  
  orange.x = orange.originalX;
  orange.y = orange.originalY;
  orange.direction = 'right';
  orange.free = false;
  orange.startTime = performance.now() / 1000;  
  pacMan.x = pacMan.originalX;
  pacMan.y = pacMan.originalY;
  pacMan.direction = 'right';
  maze.layout = maze.originalLayout.map(row => [...row]);

  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function round() {
  run = true;
  scared = false;
  
  red.x = red.originalX;
  red.y = red.originalY;
  red.direction = 'right';
  red.free = false;
  red.startTime = performance.now() / 1000;  
  blue.x = blue.originalX;
  blue.y = blue.originalY;
  blue.direction = 'right';
  blue.free = false;
  blue.startTime = performance.now() / 1000;  
  pink.x = pink.originalX;
  pink.y = pink.originalY;
  pink.direction = 'right';
  pink.free = false;
  pink.startTime = performance.now() / 1000;
  orange.x = orange.originalX;
  orange.y = orange.originalY;
  orange.direction = 'right';
  orange.free = false;
  orange.startTime = performance.now() / 1000;
  pacMan.x = pacMan.originalX;
  pacMan.y = pacMan.originalY;
  pacMan.direction = 'right';
  maze.layout = maze.originalLayout.map(row => [...row]);

  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function checkForDots() {
  for (let y = 0; y < maze.layout.length; y++) {
    for (let x = 0; x < maze.layout[y].length; x++) {
      if ([0, 2].includes(maze.layout[y][x])) return true;
    }
  }
  return false;
}

// --- Main Loop ---
lastTime = performance.now();

function gameLoop(currentTime) {
    let delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    update(delta, currentTime);
    draw();

    if (!pause && run) {
      requestAnimationFrame(gameLoop);
    }
}

draw();

// --- Buttons & Inputs ---
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

pauseBtn.addEventListener('click', function() {
  if (run) {
    pause = true;
  }
});

startBtn.addEventListener('click', function() {
  if (!pause) {
    start();
  }
  if (pause) {
    resume();
  }
});

document.addEventListener('keydown', event => {
  if (pacMan.x < 19.5 && pacMan.x > -0.5) {
    if (event.key === 'ArrowRight') pacMan.moveRight();
    if (event.key === 'ArrowLeft') pacMan.moveLeft();
    if (event.key === 'ArrowUp') pacMan.moveUp();
    if (event.key === 'ArrowDown') pacMan.moveDown();
  }
  if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
  }
});
