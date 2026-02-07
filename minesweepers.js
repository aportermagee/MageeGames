// --- Function ---
function setBoard() {
  game.mines = [];
  game.board = [];
  game.revealed = [];
  
  const pos = [
    [1, -1], [0, -1], [-1, -1],
    [1, 0], [-1, 0],
    [1, 1], [0, 1], [-1, 1],
  ];

  for (let i = 0; i < game.numMines; i++) {
    const mine = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
    
    if (game.mines.some(m => m[0] === mine[0] && m[1] === mine[1])) {
      i--;
    } else {
      game.mines.push(mine);
    }
  }

  for (let i = 0; i < 20; i++) {
    game.board.push([]);

    for (let j = 0; j < 20; j++) {
      game.board[i].push(0);
    }
  }

  for (let i = 0; i < game.numMines; i++) {
    game.board[game.mines[i]] = -1;

    for (let j = 0; j < pos.length; j++) {
      if (game.mines[i][0] + pos[j][0] < 20 && game.mines[i][0] + pos[j][0] >= 0 && game.mines[i][1] + pos[j][1] < 20 && game.mines[i][1] + pos[j][1] >= 0) {
        if (game.board[game.mines[i][1] + pos[j][1]][game.mines[i][0] + pos[j][0]] != -1) {
          game.board[game.mines[i][1] + pos[j][1]][game.mines[i][0] + pos[j][0]] += 1;
        }
      }
    }
  }
}

function draw() {
  html.ctx.fillStyle = 'rgb(0, 0, 0)';
  html.ctx.fillRect(0, 0, html.canvas.width, html.canvas.height);

  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board[i].length; j++) {
      if (!game.revealed.some(p => p[0] === j && p[1] === i)) {
        html.ctx.fillStyle = 'rgb(50, 50, 50)';
        html.ctx.fillRect(j * game.box + 1, i * game.box + 1, game.box - 2, game.box - 2);
      } else {
        if (game.board[i][j] === -1) {
          html.ctx.fillStyle = 'rgb(0, 0, 150)';
          html.ctx.fillRect(j * game.box, i * game.box, game.box, game.box);
        } else {
          html.ctx.font = '16px Roboto';
          html.ctx.fillStyle = 'rgb(200, 200, 200)';
          html.ctx.textAlign = 'center';
          html.ctx.fillText('' + game.board[i][j], j * game.box + game.box / 2, i * game.box + game.box / 2);
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
  box: 20,
  numMines: 10,
  mines: [],
  board: [],
  revealed: [[1, 1]],
};

document.addEventListener('click', event => {
  click(event);
});

setBoard();
draw();
