function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === true);
}

if (!(isLoggedIn()) {
  window.location.href = 'index.html';
}
