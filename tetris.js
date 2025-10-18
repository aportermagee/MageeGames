// Set-up
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 24;
const speed = 200;
const scoreP = document.getElementById('score');

let down = false;
let up = false;
let right = false;
let left = false;

// In-game variables
let block;

// Block types
const blocks = {
  0: [[-1, 0], [0, 0], [1, 0], [2, 0]],
  1: [[-1, 0], [0, 0], [1, 0], [1, 1]],
  2: [[-1, 0], [0, 0], [0, 1], [1, 0]],
  3: [[0, 0], [0, 1], [1, 0], [1, 1]],
  4: [[-1, 1], [0, 0], [0, 1], [1, 0]],
  5: [[-1, 0], [0, 0], [0, 1], [1, 1]],
  6: [[-1, 1], [0, 1], [1, 1], [1, 0]] 
};

// Rows
let rows = [];

for (let i = 0; i < 20; i++) {
  rows.push([]);
}

// Checks keys
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') left = true;
  if (event.key === 'ArrowRight') right = true;
  if (event.key === 'ArrowUp') up = true;
  if (event.key === 'ArrowDown') down = true;
});

document.addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft') left = false;
  if (event.key === 'ArrowRight') right = false;
  if (event.key === 'ArrowUp') up = false;
  if (event.key === 'ArrowDown') down = false;
});


// Draws a frame
function drawFrame() {
  
  // Clears frame
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height;

  // Creates a falling block if none already exist
  if (!block) {
    block = blocks[Math.floor(Math.random() * 7)];

    for (let i = 0; i < 4; i++) {
      block[i][0] = (5 + block[i][0]) * box;
      block[i][1] = (-1 + block[i][1]) * box;
    }
  }

  // Block falls by one row
  for (let i = 0; i < 4; i++) {
    block[i][1] -= box;
  }

  // Move block horizontally
}


// Buttons
const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', function() {
  window.location.href = 'home.html';
});
