
"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { emailSignup } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(emailSignup({ firstName, lastName, email, password })).then((res) => {
      if (res.payload) {
        localStorage.setItem('user', JSON.stringify(res.payload)); // Save user to localStorage
        router.push('/login'); // Redirect after signup
      }
    });
};

  const handleRoute = (e)=>{
    e.preventDefault();
    router.push('/login')
}

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
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
      <button type="submit">Sign Up</button>
      <p>Already have an account? <span onClick={handleRoute} style={{color: 'red', cursor: 'pointer'}}> Log in </span> </p>
    </form>
  );
}
