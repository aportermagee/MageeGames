// --- Initialize Supabase ---
const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Set up
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const box = 20;
const smallBox = 10;
const speed = 200;
const scoreP = document.getElementById('score');

// High score
let highScore;

async function getHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .select('highScoreSpaceInvaders')
    .eq('id', JSON.parse(localStorage.getItem('user')).id)
    .single();

  if (error) {
    console.error(error);
  } else {
    highScore = data.highScoreSpaceInvaders;
  }
}

getHighScore().then(function() {
  scoreP.textContent = 'Score: 0 | High Score: ' + highScore;
});

async function updateHighScore() {
  const { data, error } = await supabaseClient
    .from('HighScores')
    .update({ highScoreSpaceInvaders: highScore })
    .eq('id', JSON.parse(localStorage.getItem('user')).id);

  if (error) {
    console.error(error);
  }
}
