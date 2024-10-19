"use client";

import { fetchUserPosts } from "@/store/slices/postSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import Seo from "@/components/Seo";
import Image from 'next/image';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user.email) {
      router.push("/login");
      return;
    }

    // Check if cached posts exist and if the user email matches
    const cachedUserEmail = localStorage.getItem('cachedUserEmail');
    const cachedData = JSON.parse(localStorage.getItem('cachedPosts'));
    const now = new Date().getTime();
    
    // Cache expiry set to 2 months (2 * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const cacheExpiry = 2 * 30 * 24 * 60 * 60 * 1000; 

    if (cachedUserEmail === user.email && cachedData && Array.isArray(cachedData.posts) && (now - cachedData.timestamp < cacheExpiry)) {
      // Use cached posts if available, email matches, and cache hasn't expired
      console.log("Using cached posts:", cachedData.posts); // Correctly log cachedData
      dispatch({ type: 'posts/fetchUserPosts/fulfilled', payload: cachedData.posts });
    } else {
      // Fetch posts from Firestore if no cache exists, email doesn't match, or cache has expired
      dispatch(fetchUserPosts(user.email)).then((response) => {
        if (response.payload) {
          // Cache the posts with timestamp and update cached email
          localStorage.setItem('cachedPosts', JSON.stringify({ posts: response.payload, timestamp: now }));
          localStorage.setItem('cachedUserEmail', user.email);
        } else {
          console.error("No posts found for user.");
        }
      }).catch((err) => {
        console.error("Failed to fetch user posts from Firestore: ", err);
      });
    }
  }, [dispatch, router]);

  const renderedPosts = useMemo(() => {
    return posts.map((post) => (
      <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
        <h3>{post.title}</h3>
        {post.fileType === 'video' ? (
          <video src={post.fileUrl} controls style={{ width: "100%", maxHeight: "300px" }} />
        ) : (
          <Image src={post.fileUrl} alt={post.title} width={500} height={300} quality={80} priority={true} />
        )}
        <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
      </div>
    ));
  }, [posts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Seo title="Your Profile" description="View Your latest Product" />
      <h1>Your Profile</h1>
      <h2>Your Posts</h2>
      {posts.length > 0 ? renderedPosts : <p>No posts found.</p>}
    </div>
  );
};

export default UserProfile;
