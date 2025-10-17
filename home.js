// Returns whether the user is logged in
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

// Logs the user out and returns them to the login page
function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
}

// Uses isLoggedIn to return user to the login page
if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

// Elements from the html file
const logoutBtn = document.getElementById('logoutBtn');
const snakeGameBtn = document.getElementById('snakeGameBtn');

// Checks whether the user has pressed the logout button
logoutBtn.addEventListener('click', function() {
  logout();
});

snakeGameBtn.addEventListener('click', function() {
  window.location.href = 'snakeGame.html';
});
