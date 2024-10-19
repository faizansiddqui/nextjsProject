"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Redirect to login if no user
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  // Return children if user exists in localStorage
  return <>{children}</>;
}
