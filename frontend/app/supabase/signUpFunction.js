import supabase from './supabaseClient.js';

export default async function signUp(email, password) {

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { error };
  }

  return { data };
}