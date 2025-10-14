function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
  header.textContent = 'Welcome ' + localStorage.getItem('username');
}

const logoutBtn = document.getElementById('logoutBtn');
const header = document.getElementById('header');

logoutBtn.addEventListener('click', function() {
  logout();
});
