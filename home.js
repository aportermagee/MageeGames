// Logs out the user
function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
}

// Checks if the user is logged in
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

// Buttons
const logoutBtn = document.getElementById('logoutBtn');
const snakeGameBtn = document.getElementById('snakeGameBtn');
const tetrisBtn = document.getElementById('tetrisBtn');

logoutBtn.addEventListener('click', function() {
  logout();
});

snakeGameBtn.addEventListener('click', function() {
  window.location.href = 'snakeGame.html';
});

tetrisBtn.addEventListener('click', function() {
  window.location.href = 'tetris.html';
});
