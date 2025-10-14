function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

function logout() {
  localStorage.removeItem('loggedIn');
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}

const logoutBtn = document.getElementById('logoutBtn');
