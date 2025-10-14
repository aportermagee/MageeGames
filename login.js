// Attempts to log in the user
function submit(username, password) {
  if (users[username] === password) {
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('username', username);
    window.location.href = 'home.html';
  } else {
    errorMessage.textContent = 'Incorrect username or password';
  }
}

// Returns whether the user is logged in
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

// Bypasses the Log-In page if the user is logged-in
if (isLoggedIn()) {
  window.location.href = 'home.html';
}

// Usernames and passwords
const users = {
  "amagee": "apm2010!",
};

// Elements from the html file
const username = document.getElementById('username');
const password = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');

// Checks whether user has pressed the submit button
submitBtn.addEventListener('click', function() {
  submit(username.value, password.value);
});
