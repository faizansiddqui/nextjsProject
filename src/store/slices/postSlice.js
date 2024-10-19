import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

// Thunk to create a new post
// Thunk to create a new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ title, businessName, userName, description, hashtags, fileUrl, fileType, user }, { rejectWithValue }) => {
      try {
          const postRef = collection(firestore, 'posts');
          const newPost = {
              title,
              businessName,
              userName,
              description,
              hashtags: hashtags.split(','), // Split hashtags into an array
              fileUrl,
              fileType, // 'image' or 'video'
              user,
              createdAt: new Date().toISOString(),
          };

          // Add new post to Firestore
          await addDoc(postRef, newPost);
          return newPost;
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);


// Thunk to fetch posts from Firestore for a specific user
export const fetchUserPosts = createAsyncThunk(
    'posts/fetchUserPosts',
    async (userEmail, { rejectWithValue }) => {
        try {
            const postsRef = collection(firestore, 'posts');
            const q = query(postsRef, where('user', '==', userEmail)); // Filter posts by user email
            const querySnapshot = await getDocs(q);
            const userPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            return userPosts; // Return fetched posts
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to fetch all public posts from Firestore
export const fetchAllPosts = createAsyncThunk(
    'posts/fetchAllPosts',
    async (_, { rejectWithValue }) => {
        try {
            const postsRef = collection(firestore, 'posts');
            const querySnapshot = await getDocs(postsRef);
            const allPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            return allPosts; // Return all posts
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state for the post slice
const initialState = {
    posts: [],
    loading: false,
    error: null,
};

// Create the post slice
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchUserPosts cases
            .addCase(fetchUserPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload; // Ensure posts is an array
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetchAllPosts cases
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload; // Set posts to all fetched posts
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle createPost cases
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts.push(action.payload); // Add the new post to the state
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export the post reducer
export default postSlice.reducer;