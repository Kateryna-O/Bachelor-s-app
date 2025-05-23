import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = userId => {
  const socket = useRef();
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    console.log('Connecting to socket server...');
    socket.current = io('http://localhost:8800');

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);
      socket.current.emit('new-user-add', userId);
    });

    socket.current.on('receive-message', message => {
      console.log('Received message from socket:', message);
      setReceiveMessage(message);
    });

    socket.current.on('get-users', users => {
      console.log('Online users updated:', users);
      setOnlineUsers(users);
    });

    socket.current.on('disconnect', reason => {
      console.log('Socket disconnected:', reason);
    });

    return () => {
      console.log('Disconnecting socket...');
      socket.current.disconnect();
    };
  }, [userId]);

  const sendMessage = message => {
    console.log('Sending message via socket:', message);
    socket.current.emit('send-message', message);
  };

  return { sendMessage, receiveMessage, onlineUsers };
};
