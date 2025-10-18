// Set up
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 24;
const speed = 200;
const scoreP = document.getElementById('score');

// Block types
const blocks = {
  1: [[-1, 0], [0, 0], [1, 0], [2, 0]],
  2: [[-1, 0], [0, 0], [1, 0], [1, 1]],
  3: [[-1, 0], [0, 0], [0, 1], [1, 0]],
  4: [[0, 0], [0, 1], [1, 0], [1, 1]],
  5: [[-1, 1], [0, 0], [0, 1], [1, 0]],
  6: [[-1, 0], [0, 0], [0, 1], [1, 1]],
  7: [[-1, 1], [0, 1], [1, 1], [1, 0]] 
};

// Buttons
const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', function() {
  window.location.href = 'home.html';
});
