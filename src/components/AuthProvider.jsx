"use client";  // Ensures this component is a client component

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess } from '../store/slices/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>; // Render children components after authentication
};

export default AuthProvider;
