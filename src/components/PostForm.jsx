"use client";

import { storage } from "@/firebaseConfig";
import { createPost } from "@/store/slices/postSlice";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useDispatch } from "react-redux";
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return router.push('/login');
    }

    if (!title || !file || !businessName || !userName || !description || !hashtags) {
      alert('Please fill all the fields and select a file to upload.');
      return;
    }

    try {
      let fileUrl = '';
      let fileType = '';

      const mimeType = file.type;
      if (mimeType.startsWith('image/')) {
        fileType = 'image';
      } else if (mimeType.startsWith('video/')) {
        fileType = 'video';
      } else {
        alert('Unsupported file type. Please upload an image or video.');
        return;
      }

      if (file) {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            console.error(error);
            alert('Error uploading file');
          },
          async () => {
            fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Dispatch createPost action with all necessary data
            dispatch(createPost({ 
              title, 
              businessName, 
              userName, 
              description, 
              hashtags, 
              fileUrl, 
              fileType, 
              user: user.email 
            }));

            // Clear form and reset progress after successful upload
            alert('Post Successful');
            setProgress(0);
            setTitle('');
            setBusinessName('');
            setUserName('');
            setDescription('');
            setHashtags('');
            setFile(null);
          }
        );
      }
    } catch (error) {
      console.log(error);
      alert('Failed to upload post.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your title"
        required
      />
      <input
        type="text"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        placeholder="Enter your business name"
        required
      />
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your user name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        required
      />
      <input
        type="text"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        placeholder="Enter hashtags (comma-separated)"
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*,video/*"
        required
      />
      {progress > 0 && <p>Uploading... {Math.round(progress)}%</p>}
      <button type="submit">Post</button>
    </form>
  );
}
