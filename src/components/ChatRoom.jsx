"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { firestore } from '@/firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import styles from './ChatRoom.module.css';
import { useRouter } from 'next/navigation';

const ChatRoom = ({ chatId }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (chatId && user) {
      const messagesRef = collection(firestore, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesList);
      });

      return () => unsubscribe();
    }
  }, [chatId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && user) {
      const tempMessage = {
        senderId: user.uid,
        message: newMessage,
        createdAt: Timestamp.fromDate(new Date()),
      };
  
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setNewMessage('');
  
      try {
        const messagesRef = collection(firestore, `chats/${chatId}/messages`);
        await addDoc(messagesRef, tempMessage);
        console.log('Message sent:', tempMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message!');  // Provide an alert on failure
        setMessages((prevMessages) => prevMessages.filter(msg => msg !== tempMessage));
      }
    } else {
      console.log('User or message is invalid');
    }
  };

  return (
    <div className={styles.chatRoom}>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} className={msg.senderId === user.uid ? styles.sentMessage : styles.receivedMessage}>
            {msg.message}
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.inputField}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
