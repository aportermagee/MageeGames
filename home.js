// --- Initialize Supabase ---
const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Logs out the user
function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('user');
  supabaseClient.auth.signOut();
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
const spaceInvadersBtn = document.getElementById('spaceInvadersBtn');

logoutBtn.addEventListener('click', function() {
  logout();
});

snakeGameBtn.addEventListener('click', function() {
  window.location.href = 'snakeGame';
});

tetrisBtn.addEventListener('click', function() {
  window.location.href = 'tetris';
});

spaceInvadersBtn.addEventListener('click', function() {
  window.location.href = 'spaceInvaders'
