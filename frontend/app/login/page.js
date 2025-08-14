// components/LoginPage.js
"use client";
import { useState } from 'react';
import signIn from '../../../supabase/signInFunction.js'; // Adjust the import path as necessary
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleLogin = async () => {
  const { data, error } = await signIn(email, password);
  if (error) {
    alert(`Login failed: ${error.message}`);
  } else {
    console.log('Login successful:', data);
    router.push("/"); 
  }
};

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #d9e4ff, #f0f4ff)',
        padding: '2rem',
      }}
    >
      <form
        style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', color: '#4364F7' }}>Log Analyzer Login</h2>

        <label
          htmlFor="email"
          style={{
            display: 'block',
            textAlign: 'left',
            marginBottom: '0.5rem',
            fontWeight: '600',
          }}
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            marginBottom: '1.25rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <label
          htmlFor="password"
          style={{
            display: 'block',
            textAlign: 'left',
            marginBottom: '0.5rem',
            fontWeight: '600',
          }}
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC)',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '1rem',
            }}

            onClick={handleLogin}
          >
            Log In
          </button>

          <button
            type="button"
            style={{
              flexShrink: 0,
              padding: '0.75rem 1.2rem',
              background: '#eee',
              color: '#4364F7',
              fontWeight: '700',
              fontSize: '1.1rem',
              borderRadius: '10px',
              border: '2px solid #4364F7',
              cursor: 'pointer',
            }}
            onClick={() => router.push("/signup")} // Redirect to signup page)}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
