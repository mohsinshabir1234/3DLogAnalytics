"use client";
import React, { useState, useEffect } from 'react';
import LoginPage from '../components/authentication/loginPage';
import Header from '../components/extras/header';
import Footer from '../components/extras/footer';
import supabase from '../../supabase/supabaseClient.js';
import FileUpload from './uploadPage/page.js';
export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <Header />

  <button
    onClick={() => {
      supabase.auth.signOut();
      setSession(null);
    }}
 
  >
    Sign Out
  </button>
      {session ? (
        <div> 
          <FileUpload />
        </div>
      ) : (
        <LoginPage />
      )}
      <Footer />
    </div>
  );
}
