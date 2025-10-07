function isLoggedIn() {
  console.log(localStorage.getItem('loggedIn'));
  return (localStorage.getItem('loggedIn') == true);
}

if (!(isLoggedIn())) {
  window.location.href = 'index.html';
}
