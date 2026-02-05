// --- Function ---
function setBoard() {
  game.mines = [];
  game.board = [];

  for (let i = 0; i < game.numMines; i++) {
    const mine = [Math.round(Math.random() * 40), Math.round(Math.random() * 40)];
    
    if (game.mines.includes(mine)) {
      i--;
    } else {
      game.mines.push(mine);
    }
  }

  for
}

function click(event) {
  const rect = html.canvas.getBoundingClientRect();
  
  const x = Math.abs(event.clientX - rect.left) / game.box;
  const y = Math.abs(event.clientY - rect.top) / game.box;
}

// --- Variables ---
const html = {
  canvas: document.getElementById('canvas'),
  ctx: document.getElementById('canvas').getContext('2d'),
  exit: document.getElementById('exitButton'),
  reset: document.getElementById('resetButton'),
};

const game = {
  box: 10,
  numMines: 10,
  mines: [],
  board: [],
};

document.addEventListener('click', event => {
  click(event);
});
