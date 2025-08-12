import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(`${BASEURL}`, {
      // withCredentials: true,
      // transports: ["websocket"]
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};