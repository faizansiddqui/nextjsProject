"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "@/store/slices/postSlice"; // Ensure this is correct
import Seo from "@/components/Seo";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PublicProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    // Get posts from Redux state
    const { posts, loading, error } = useSelector((state) => state.posts);

    // Get the current logged-in user from Redux state (assuming it's stored here)
    const user = useSelector((state) => state.auth.user);

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
                        <div
                            key={post.id}
                            style={{
                                border: "1px solid #ccc",
                                margin: "10px",
                                padding: "10px",
                            }}
                        >
                            <h3>{post.title}</h3>
                            {post.fileType === "video" ? (
                                <video
                                    src={post.fileUrl}
                                    controls
                                    style={{ width: "100%", maxHeight: "300px" }}
                                />
                            ) : (
                                <Image
                                    src={post.fileUrl}
                                    alt={post.title}
                                    width={500}
                                    height={300}
                                    quality={80}
                                    priority={true}
                                    style={{ objectFit: "cover" }} // Optional: Maintain aspect ratio
                                />
                            )}
                            <p>Posted by: {post.userName}</p>
                            <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
                            <p>Description: {post.description}</p>
                            <p>
                                Hashtags:{" "}
                                {Array.isArray(post.hashtags)
                                    ? post.hashtags.join(", ")
                                    : "No hashtags"}
                            </p>

                            {/* Ensure user is defined before rendering the Chat button */}
                            {user ? (
                                <button onClick={() => router.push(`/chat/${user.uid}`)}>
                                    Chat
                                </button>
                            ) : (
                                <p>Please log in to chat.</p>
                            )}

                        </div>
                    ))
                ) : (
                    <p>No public posts found.</p>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;
