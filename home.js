function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'index.html';
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', function() {
  logout();
}
