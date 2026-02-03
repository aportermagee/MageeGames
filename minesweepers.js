
// --- Variables ---
const html = {
  canvas: document.getElementById('canvas'),
  ctx: document.getElementById('canvas').getContext('2d'),
  exit: document.getElementById('exitButton'),
  reset: document.getElementById('resetButton'),
};

const game = {
  box: 10,
  mines: [],
};
