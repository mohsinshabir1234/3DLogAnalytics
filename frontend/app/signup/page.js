"use client";
import React, { useState } from 'react';
import signUpFunction from '../../../supabase/signUpFunction.js';
import { useRouter } from "next/navigation";

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await signUpFunction(email, password);
    if (error) {
      alert(`Signup failed: ${error.message}`);
    } else {
      alert('Check your email for confirmation!');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC)',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#4364F7' }}>
          Sign Up
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' }}
          required
        />

        <button
          type="submit"
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC)',
            color: 'white',
            fontWeight: '700',
            fontSize: '1.1rem',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </form>
      <button
        onClick={() => router.push("/login")}
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#ccc',
          color: 'black',
          fontWeight: '700',
          fontSize: '1.1rem',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Already have an account? Log In
      </button>
    </div>
  );
}

export default SignupForm;
