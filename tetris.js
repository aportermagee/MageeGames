const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 24;
const speed = 200;

const homeBtn = document.getElementById('homeBtn');

homeBtn.addEventListener('click', function() {
  window.location.href = 'home.html';
});
