"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserPosts } from "@/store/slices/postSlice"; // Fetch posts action
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts); // Select posts state from Redux store
  const router = useRouter();

  // Fetch user data from localStorage or redirect to login if user not found
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    } else {
      // Fetch user posts via Redux thunk
      dispatch(fetchUserPosts(user.email));
    }
  }, [dispatch, router]);

  // Check if file is a video based on its extension
  const isVideo = (fileUrl) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(fileUrl); // Add more extensions if needed
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <h2>Your Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{post.title}</h3>

            {/* Check if the file is a video or an image */}
            { post.fileType === 'video' ? (
              <video
                src={post.fileUrl}
                controls
                style={{ width: "100%", maxHeight: "300px" }}
              />
            ) : (
              <img
                src={post.fileUrl}
                alt={post.title}
                style={{ width: "100%", maxHeight: "300px" }}
              />
            )}

            <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}




// Second 





  // Check if cached posts exist and if the user email matches
  const cachedUserEmail = localStorage.getItem('cachedUserEmail');
  const cachedPosts = JSON.parse(localStorage.getItem('cachedPosts'));

  if (cachedUserEmail === user.email && cachedPosts && Array.isArray(cachedPosts)) {
      // Use cached posts if available and email matches
      dispatch({ type: 'posts/fetchUserPosts/fulfilled', payload: cachedPosts });
  } else {
      // If no cache exists or email doesn't match, fetch posts from Firestore
      dispatch(fetchUserPosts(user.email)).then((response) => {
          console.log("Fetched user posts: ", response.payload); // Log fetched posts

          if (response.payload) {
              // Cache the posts and update the cached email
              localStorage.setItem('cachedPosts', JSON.stringify(response.payload));
              localStorage.setItem('cachedUserEmail', user.email);
          } else {
              console.error("No posts found for user."); // Log if no posts were fetched
          }
      }).catch((err) => {
          console.error("Failed to fetch user posts from Firestore: ", err);
      });
  }


  // Public Profile Code

  import { firestore } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Seo from "@/components/Seo";
import Image from "next/image";

export default function PBublicProgfdfile({ PublfdficProfile }) {
    // Log the received PublicProfile data
    console.log("PublicProfile Data:", PublicProfile);

    if (!PublicProfile) return <p>Profile Not Found</p>;

    const { username, bussinessType, description, title, profileImage } = PublicProfile;

    return (
        <div>
            {/* Dynamic SEO Components for public profile */}
            <Seo 
                title={`${username}'s Profile - ${bussinessType}`} 
                description={description} 
                keywords={`${username}, ${bussinessType}, ${title}`} 
            />

            <h1>{username}</h1>
            <h2>{title}</h2>
            <p>Business Type: {bussinessType}</p>
            <p>{description}</p>

            <Image
                src={profileImage}
                alt={`${username}'s profile image`}
                width={500}
                height={500}
                quality={80}
                loading="lazy"
            />

            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": username,
                    "jobTitle": bussinessType,
                    "description": description,
                })}
            </script>
        </div>
    );
}

// Fetch all user emails to generate static paths for SEO
export async function getStaticPaths() {
    const userRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(userRef);

    const paths = querySnapshot.docs.map(doc => ({
        params: { userEmail: doc.data().email },
    }));

    return {
        paths,
        fallback: 'blocking', // ISR (incremental static generation)
    };
}

// Fetch individual profile data for a specific user by email
export async function getStaticProps({ params }) {
    const { userEmail } = params;
    console.log(params);
    
    const userRef = collection(firestore, 'users');

    const q = query(userRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { notFound: true };
    }

    const PublicProfile = querySnapshot.docs[0].data();

    return {
        props: { PublicProfile },
        revalidate: 10, // Incremental static regeneration
    };
}



// public profile code 


"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "@/store/slices/postSlice"; // Ensure this is correct
import Seo from "@/components/Seo";
import Image from "next/image";

const PublicProfile = () => {
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector((state) => state.posts);

    useEffect(() => {
        // Fetch all public posts on component mount
        dispatch(fetchAllPosts());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Seo title="Public Profiles" description="Explore posts from all users" />
            <h1>Public Profiles</h1>
            <div>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                            <h3>{post.title}</h3>
                            {post.fileType === 'video' ? (
                                <video src={post.fileUrl} controls style={{ width: "100%", maxHeight: "300px" }} />
                            ) : (
                                <Image 
                                    src={post.fileUrl} 
                                    alt={post.title} 
                                    width={500} 
                                    height={300} 
                                    quality={80} 
                                    priority={true} 
                                    style={{ objectFit: 'cover' }} // Optional: Maintain aspect ratio
                                />
                            )}
                            <p>Posted by: {post.userName}</p> {/* Display username */}
                            <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
                            <p>Description: {post.description}</p> {/* Display description */}
                            <p>Hashtags: {Array.isArray(post.hashtags) ? post.hashtags.join(', ') : 'No hashtags'}</p>
                        </div>
                    ))
                ) : (
                    <p>No public posts found.</p>
                )}
            </div>
        </div>
    );
};

// export default PublicProfile;




// post slice  code 

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
// export default postSlice.reducer;

// Export the thunks for use in components
// Remove this duplicate line if it already exists earlier in the file
// export { fetchAllPosts, fetchUserPosts, createPost }; 
