import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket.io doesn't work on Vercel serverless, so we disable it in production
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Only enable socket.io for local development
    if (API_URL.includes('localhost')) {
      const newSocket = io(API_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true
      });

      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      console.log('Socket.io disabled for serverless deployment');
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
