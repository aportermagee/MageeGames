// Bypasses the Log-In page if the user is logged-in
if (localStorage.getItem('loggedIn' === true)) {
  window.location.href = 'home.html';
}

// Prevents the user from accessing the file
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function(event) {
  if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J'))) {
    event.preventDefault();
  }
});

// Usernames and passwords
users = {
  "amagee": "apm2010!",
};
