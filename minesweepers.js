// --- Function ---
function setBoard() {
  game.mines = [];
  game.board = [];
  game.revealed = [];
  game.flagged = [];
  game.over = false;
  
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
    game.board[game.mines[i][1]][game.mines[i][0]] = -1;

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
  html.ctx.fillStyle = 'rgb(0, 10, 30)';
  html.ctx.fillRect(0, 0, html.canvas.width, html.canvas.height);

  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board[i].length; j++) {
      if (!game.revealed.some(p => p[0] === j && p[1] === i)) {
        html.ctx.fillStyle = 'rgb(0, 20, 60)';
        html.ctx.fillRect(j * game.box, i * game.box, game.box, game.box);
        
        html.ctx.strokeStyle = 'rgb(0, 40, 120)';
        html.ctx.strokeRect(j * game.box, i * game.box, game.box, game.box);
        
        if (game.flagged.some(p => p[0] === j && p[1] === i)) {
          html.ctx.fillStyle = 'rgb(175, 0, 0)';
          html.ctx.beginPath();
          html.ctx.moveTo((j + 0.25) * game.box, (i + 0.15) * game.box);
          html.ctx.lineTo((j + 0.25) * game.box, (i + 0.6) * game.box);
          html.ctx.lineTo((j + 0.8) * game.box, (i + 0.4) * game.box);
          html.ctx.lineTo((j + 0.25) * game.box, (i + 0.15) * game.box);
          html.ctx.fill();
          
          html.ctx.fillStyle = 'rgb(200, 200, 200)';
          html.ctx.fillRect((j + 0.25) * game.box, (i + 0.175) * game.box, 1, game.box * 0.55);
        }
      } else {
        if (game.board[i][j] === -1) {
          html.ctx.fillStyle = 'rgb(175, 0, 0)';
          html.ctx.fillRect(j * game.box, i * game.box, game.box, game.box);
        } else {
          if (game.board[i][j] !== 0) {
            html.ctx.font = 'bold 15px Tahoma';
            html.ctx.fillStyle = 'rgb(200, 200, 200)';
            html.ctx.textAlign = 'center'; 
            html.ctx.fillText('' + game.board[i][j], j * game.box + game.box / 2, (i + 0.75) * game.box);
          }
          
          html.ctx.lineWidth = 1;
          html.ctx.strokeStyle = 'rgb(0, 30, 90)';
          html.ctx.strokeRect(j * game.box, i * game.box, game.box, game.box);
        }
      }
    }
  }
}

function emptySpace(x, y) {
  const pos = [
    [1, -1], [0, -1], [-1, -1],
    [1, 0], [-1, 0],
    [1, 1], [0, 1], [-1, 1],
  ];
  
  for (let i = 0; i < pos.length; i++) {
    if (x + pos[i][0] < 20 && x + pos[i][0] >= 0 && y + pos[i][1] < 20 && y + pos[i][1] >= 0) {
      if (!game.revealed.some(p => p[0] === x + pos[i][0] && p[1] === y + pos[i][1])) {
        game.revealed.push([x + pos[i][0], y + pos[i][1]]);
      
        if (game.board[y + pos[i][1]][x + pos[i][0]] === 0) {
          emptySpace(x + pos[i][0], y + pos[i][1]);
        }
      }
    }
  }
}

function handleClick(event) {
  const rect = html.canvas.getBoundingClientRect();
  
  const x = Math.floor(Math.abs(event.clientX - rect.left) / game.box);
  const y = Math.floor(Math.abs(event.clientY - rect.top) / game.box);
  
  if (x < 0 || x >= 20 || y < 0 || y >= 20) return;
  
  if (!game.revealed.some(p => p[0] === x && p[1] === y)) {
    game.revealed.push([x, y]);
  }
  
  if (game.board[y][x] === -1) {
    game.over = true;
    game.revealed.push(...game.mines);
  }
  
  if (game.board[y][x] === 0) {
    emptySpace(x, y);
  }
  
  draw();
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
  numMines: 40,
  mines: [],
  board: [],
  revealed: [],
  flagged: [],
  over: false,
};

// --- Initialization ---
const dpr = window.devicePixelRatio || 1;
html.canvas.width = 400 * dpr;
html.canvas.height = 400 * dpr;
html.canvas.style.width = '400px';
html.canvas.style.height = '400px';
html.ctx.scale(dpr, dpr);

setBoard();
draw();


document.addEventListener('click', event => {
  if (!game.over) {
    handleClick(event);
  }
});
