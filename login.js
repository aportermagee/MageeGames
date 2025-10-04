function submit(username, password) {
  if (users[username] === password) {
    alert('loggedIn');
  } else {
    errorMessage.textContent = 'Incorrect username or password';
  }
};

// Bypasses the Log-In page if the user is logged-in
if (localStorage.getItem('loggedIn' === true)) {
  window.location.href = 'home.html';
}

// Prevents the user from accessing the file
/*
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function(event) {
  if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J'))) {
    event.preventDefault();
  }
});
*/

// Usernames and passwords
const users = {
  "amagee": "apm2010!",
};

const username = document.getElementById('username');
const password = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
let errorMessage = document.getElementById('errorMessage');

submitBtn.addEventListener('click', function() {
  submit(username.value, password.value);
});
