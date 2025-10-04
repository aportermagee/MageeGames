users = {
  "amagee": "apm2010!",
};

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function(event) {
  if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J'))) {
    event.preventDefault();
  }
});
