// Directions
alert('Controls:\nRight Arrow: Right\nLeft Arrow: Left\nUp Arrow: Rotate Clockwise\nDown Arrow: Rotate Counter-Clockwise\nSpace Bar: Speed Up Fall');

// Set-up
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 24;
const speed = 50;
const scoreP = document.getElementById('score');

// In-game variables
let block;
let rows;
let game;
let count;

// Block types
const blocks = {
  0: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  1: [
    [1, 1],
    [1, 1]
  ],
  2: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  3: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  4: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  5: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  6: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

function start() {
  // Rows
  rows = [];

  for (let i = 0; i < 20; i++) {
    let row = [];

    for (let x = 0; x < 10; x++) {
      row.push(0);
    }
  
    rows.push(row);
  }

  // Resets count
  count = 10;
  
  // Draws the frames of the game
  game = setInterval(drawFrame, speed);
}


// Rotate
function rotateClockwise() {
  block[0] = transpose(block[0]);
  block[0] = reverse(block[0]);

  if (isColliding(block)) {
    block[0] = reverse(block[0]);
    block[0] = transpose(block[0]);
  }
}

function rotateCounterClockwise() {
  block[0] = reverse(block[0]);
  block[0] = transpose(block[0]);

  if (isColliding(block)) {
    block[0] = transpose(block[0]);
    block[0] = reverse(block[0]);
  }
}


// Move
function moveRight() {
  block[1] += 1;

  if (isColliding(block)) {
    block[1] -= 1;
  }
}

function moveLeft() {
  block[1] -= 1;

  if (isColliding(block)) {
    block[1] += 1;
  }
}


// Checks keys
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') moveLeft();
  if (event.key === 'ArrowRight') moveRight();
  if (event.key === 'ArrowUp') rotateClockwise();
  if (event.key === 'ArrowDown') rotateCounterClockwise();
});


// Transposes rows and columns in a 2d matrix
function transpose(L) {
  let final = [];
  
  for (let i = 0; i < L.length; i++) {
    final.push([]);
  }

  for (let i = 0; i < L.length; i++) {
    for (let x = 0; x < L[i].length; x++) {
      final[x].push(L[x][i]);
    }
  }
  return final;
}


// Reverse the values of the rows of a 2d matrix
function reverse(L) {
  for (let i = 0; i < L.length; i++) {
    L[i].reverse();
  }
  return L;
}


// Checks Collisions
function isColliding(B) {
  for (let y = 0; y < B[0].length; y++) {
    for (let x = 0; x < B[0][y].length; x++) {
      if (B[0][y][x] === 1) {
        if (
          (B[1] + x) < 0 ||
          (B[1] + x) >= 10 ||
          (B[2] + y) >= 20
        ) {
          return true;
        }

        if (rows[B[2] + y][B[1] + x] === 1) {
          return true;
        }
      }
    }
  }
  return false;
}



// Draws a frame
function drawFrame() {
  // Creates a falling block if none already exist
  if (!block) {
    block = [blocks[Math.floor(Math.random() * 7)], 4, 0];
    return;
  }
  
  // Clears frame
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  
  // Gravity
  if (count === 0) {
    count = 10;
    block[2] += 1;
  
    // If the the block is colliding it gets set permentently in rows
    if (isColliding(block)) {
      block[2] -= 1;
      
      for (let y = 0; y < block[0].length; y++) {
        for (let x = 0; x < block[0][y].length; x++) {
          
          // Sets rows
          if (block[0][y][x] === 1) {
            rows[block[2] + y][block[1] + x] = 1;
          }
        }
      }
        
      block = null;
  
      for (let i = 0; i < 20; i++) {
        if (!rows[i].some(b => b === 0)) {
          rows.splice(i, 1);
  
          let row = []
  
          for (let x = 0; x < 10; x++) {
            row.push(0);
          }
          
          rows.unshift(row);
        }
      }
    }
  }

  // Add blocks
  let RaB = rows.map(row => [...row]);

  if (block) {
    for (let y = 0; y < block[0].length; y++) {
      for (let x = 0; x < block[0][y].length; x++) {
        if (block[0][y][x] === 1) {
          RaB[block[2] + y][block[1] + x] = 1;
        }
      }
    }
  }

  for (let y = 0; y < RaB.length; y++) {
    for (let x = 0; x < RaB[y].length; x++) {
      if (RaB[y][x] === 1) {
        ctx.fillStyle = 'rgb(0, 120, 200)';
        ctx.fillRect(x * box, y * box, box, box);
      }
    }
  }

  // End game
  if (rows[0].some(b => b === 1)) {
    clearInterval(game);
    game = null;
  }

  count -= 1;
}


start();

// Buttons
const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', function() {
  window.location.href = 'home.html';
});
