// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import for Firebase Authentication
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyD1Sxx4Hk4-NBDaSHoXCjXPMy3SsxxasSI",
    authDomain: "lawyerweb2.firebaseapp.com",
    projectId: "lawyerweb2",
    storageBucket: "lawyerweb2.appspot.com",
    messagingSenderId: "837171480437",
    appId: "1:837171480437:web:deb224da87cacff6e2753c",
    databaseURL: "https://lawyerweb-b7046-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);  // Export the auth instance

// Firbase Store
export const storage = getStorage(app)