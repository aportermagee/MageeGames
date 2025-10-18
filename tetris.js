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

  
}


// Buttons
const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', function() {
  window.location.href = 'home.html';
});
