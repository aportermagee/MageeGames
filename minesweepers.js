// --- Function ---
function setBoard() {
  game.mines = [];
  game.board = [];
  const pos = [
    [1, -1], [0, -1], [-1, -1],
    [1, 0], [-1, 0],
    [1, 1], [0, 1], [-1, 1],
  ];

  for (let i = 0; i < game.numMines; i++) {
    const mine = [Math.round(Math.random() * 40), Math.round(Math.random() * 40)];
    
    if (game.mines.includes(mine)) {
      i--;
    } else {
      game.mines.push(mine);
    }
  }

  for (let i = 0; i < 40; i++) {
    game.board.push([]);

    for (let j = 0; j < 40; j++) {
      game.board[i].push(0);
    }
  }

  for (let i = 0; i < numMines; i++) {
    game.board[game.mines[i]] = -1;

    for (let j = 0; j < pos.length; j++) {
      if (game.mines[i][0] + pos[j][0] < 40 && game.mines[i][0] + pos[j][0] >= 0 && game.mines[i][1] + pos[j][1] < 40 && game.mines[i][1] + pos[j][1] >= 0) {
        if (game.board[game.mines[i][1] + pos[j][1]][game.mines[i][0] + pos[j][0]] != -1) {
          game.board[game.mines[i][1] + pos[j][1]][game.mines[i][0] + pos[j][0]] += 1;
        }
      }
    }
  }
}

function draw() {
  html.ctx.fillStyle = 'rgb(0, 0, 0)';
  html.ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board[i].length; j++) {
      if (!game.revealed.includes([i, j])) {
        html.ctx.fillStyle = 'rgb(50, 50, 50)';
        html.ctx.fillRect(j * box + 1, i * box + 1, box - 2, box - 2);
      } else {
        if (game.board[i][j] === -1) {
          html.ctx.fillStyle = 'rgb(0, 0, 150)';
          html.ctx.fillRect(j * box, i * box, box, box);
        } else {
          html.ctx.font = '16px Roboto';
          html.ctx.fillStyle = 'rgb(200, 200, 200)';
          html.ctx.textAlign = 'center';
          html.ctx.fillText('' + game.board[i][j], j * box + box / 2, i * box + box / 2);
        }
      }
    }
  }
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
  revealed: [];
};

document.addEventListener('click', event => {
  click(event);
});

setBoard();
draw();
