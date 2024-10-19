import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebaseConfig'; // Firestore instance
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

// Thunk for login with email and password
export const emailLogin = createAsyncThunk('auth/emailLogin', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    
    // Return only serializable fields
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for signup with email and password
export const emailSignup = createAsyncThunk('auth/emailSignup', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    const userDoc = doc(firestore, 'users', user.uid); // Create a document for the user
    await setDoc(userDoc, {
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });

    // Return only serializable fields
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(emailLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(emailLogin.fulfilled, (state, action) => {
        state.user = action.payload;  // payload now only contains serializable data
        state.loading = false;
        alert('Login successful!');
      })
      .addCase(emailLogin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        alert(`Login failed: ${action.payload}`);
      })
      
      // Signup cases
      .addCase(emailSignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(emailSignup.fulfilled, (state, action) => {
        state.user = action.payload;  // payload now only contains serializable data
        state.loading = false;
        alert('Signup successful!');
      })
      .addCase(emailSignup.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        alert(`Signup failed: ${action.payload}`);
      });
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
