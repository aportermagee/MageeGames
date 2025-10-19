// --- Initialize Supabase ---
const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Sign Up ---
document.getElementById('signup').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return alert('Error: ' + error.message);

  alert('Sign up successful. Please check your email to confirm');
});

// --- Login ---
document.getElementById('login').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return alert('Error: ' + error.message);

  const user = data.user;
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('supabaseClient', JSON.stringify(supabaseClient));

  const { error: insertError } = await supabaseClient
    .from('HighScores')
    .upsert([{id: user.id, highScoreSnake: 0, highScoreTetris: 0}]);
  
  window.location.href = 'home.html';
});
