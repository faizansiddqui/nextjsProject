"use client";
import ChatRoom from '@/components/ChatRoom';

const Page = ({ params }) => {
  const { uid } = params;  // Use `params` to extract the dynamic `uid` from the URL

  if (!uid) return <p>Loading...</p>; // Handle the case where `uid` isn't available

  return (
    <div>
      <ChatRoom chatId={uid} /> {/* Pass the chatId prop here */}
    </div>
  );
};

export default Page;