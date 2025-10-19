// --- Initialize Supabase ---
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://crvmgootjfbqkokrwsuu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydm1nb290amZicWtva3J3c3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MzkyNTQsImV4cCI6MjA3NjQxNTI1NH0.Em26tIW4z2ulfRePTOVhkCmcMGOa0OOjBqC3kPJ-LpU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// --- Sign Up ---
document.getElementById('signup').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert('Error: ' + error.message);

  alert('Sign up successful. Please check your email to confirm');
});

// --- Login ---
document.getElementById('login').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert('Error: ' + error.message);

  user = data.user;
  
  localStorage.setItem('user', user);
  localStorage.setItem('loggedIn', true);
  window.location.href = 'home.html';
});
