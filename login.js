function submit(username, password) {
  if (users[username] === password) {
    localStorage.setItem('loggedIn', true);
    window.location.href = 'home.html';
  } else {
    errorMessage.textContent = 'Incorrect username or password';
  }
}

function isLoggedIn() {
  return localStorage.getItem('loggedIn') === true;
}

// Bypasses the Log-In page if the user is logged-in
if (isloggedIn()) {
  window.location.href = 'home.html';
}

// Usernames and passwords
const users = {
  "amagee": "apm2010!",
};

const username = document.getElementById('username');
const password = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');

submitBtn.addEventListener('click', function() {
  submit(username.value, password.value);
});
