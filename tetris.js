// Directions
alert('Controls:\nRight Arrow: Right\nLeft Arrow: Left\nUp Arrow: Rotate Clockwise\nDown Arrow: Rotate Counter-Clockwise\nSpace Bar: Speed Up Fall');

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

// Rows
let rows = [];

for (let i = 0; i < 20; i++) {
  let row = {};

  for (let i = 0; i < 10; i++) {
    row[i] = 0;
  }
  
  rows.push(row);
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


// Transposes rows and columns in a 2d matrix
function transpose(L) {
  let final = [];
  
  for (let i = 0; i < L.length; i++) {
    final.push([]);
  }

  for (let i = 0; i < L.length; i++) {
    for (let x = 0; x < L.length(); x++) {
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


// Draws a frame
function drawFrame() {
  
  // Clears frame
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height;

  // Creates a falling block if none already exist
  if (!block) {
    block = [blocks[Math.floor(Math.random() * 7)], 5, 0];
    return;
  }

  // Rotate
  if (up) {
    
  }
}


// Buttons
const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', function() {
  window.location.href = 'home.html';
});
