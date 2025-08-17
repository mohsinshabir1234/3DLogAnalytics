import supabase from './supabaseClient.js';


export default async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Signin error:', error.message);
    return { error };
  }

  return { data };
}

