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

// Checks whether the user is logged in
function isLoggedIn() {
  return (localStorage.getItem('loggedIn') === 'true');
}

if (isLoggedIn()) {
  window.location.href = 'home.html';
}

// Usernames and passwords
const users = {
  "amagee": "apm2010!",
};

// Html constants
const username = document.getElementById('username');
const password = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Buttons
const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', function() {
  submit(username.value, password.value);
});
