// Returns whether the user is logged in
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

// Logs the user out and returns them to the login page
function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
}

// Code that needs to be run to set up the page
function start() {
  header.textContent = 'Welcome ' + localStorage.getItem('username');
}

// Uses isLoggedIn to return user to the login page
if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

// Elements from the html file
const logoutBtn = document.getElementById('logoutBtn');
const header = document.getElementById('header');

// Checks whether the user has pressed the logout button
logoutBtn.addEventListener('click', function() {
  logout();
});

// Runs start
start()
