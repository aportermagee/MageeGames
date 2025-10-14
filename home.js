function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
}

function start() {
  header.textContent = 'Welcome ' + localStorage.getItem('username');
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

const logoutBtn = document.getElementById('logoutBtn');
const header = document.getElementById('header');

logoutBtn.addEventListener('click', function() {
  logout();
});

start()
