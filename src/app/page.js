"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { firestore } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
    const router = useRouter();
    const userFromRedux = useSelector((state) => state.auth.user);
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state to track authentication check
    const [profiles, setProfiles] = useState([]);

    // Check if the user is logged in by looking into localStorage
    useEffect(() => {
        const checkUserAuth = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Set user from localStorage
            } else {
                setUser(userFromRedux); // Fallback to Redux user (if available)
            }
            setIsCheckingAuth(false); // Stop the loading state after check
        };
        checkUserAuth();
    }, [userFromRedux]);

    useEffect(() => {
        const fetchProfiles = async () => {
            const userRef = collection(firestore, "users");
            const querySnapshot = await getDocs(userRef);
            const users = querySnapshot.docs.map((doc) => doc.data());
            setProfiles(users);
        };
        fetchProfiles();
    }, []);

    const handlePostClick = () => {
        if (user) {
            router.push("/protectedRoute");
        } else {
            router.push("/login");
        }
    };

    const handleLoginClick = () => {
        router.push("/login");
    };

    const handleSignupClick = () => {
        router.push("/signup");
    };

    const handleProfile = () => {
        if (user) {
            router.push("/userProfile");
        } else {
            router.push("/login");
        }
    };

    // While checking for auth, you can display a loading screen
    if (isCheckingAuth) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={handlePostClick}>Post</button>
            {user ? (
                <button onClick={handleProfile}>User Profile</button>
            ) : (
                <>
                    <button onClick={handleLoginClick}>Login</button>
                    <button onClick={handleSignupClick}>Signup</button>
                </>
            )}
            <div>
                <h2>Public Profiles:</h2>
                {profiles.map((profile, index) => (
                    <div key={index}>
                        <h3>{profile.username}</h3>
                        <button
                            onClick={() => router.push(`/publicProfile/${profile.username}`)}
                        >
                            View {profile.username}'s Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
