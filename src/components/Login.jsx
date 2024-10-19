"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { emailLogin } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(emailLogin({ email, password })).then((res) => {
      if (res.payload) {
        localStorage.setItem('user', JSON.stringify(res.payload)); // Save user to localStorage
        router.push('/'); // Redirect after login
      }
    });
  };

  const handleRoute = (e)=>{
    e.preventDefault();
    router.push('/signup')
  }
  const handleGoogleLogin = () => {
    // Handle Google login here
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleGoogleLogin}>Login with Google</button>
      <button type="button" onClick={handleFacebookLogin}>Login with Facebook</button>
      <p>Don't have an account? <span onClick={handleRoute} style={{color: 'red', cursor: 'pointer'}}>Sign up</span></p>
    </form>
  );
}
