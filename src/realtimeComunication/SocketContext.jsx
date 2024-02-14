import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initSocket = () => {
      const userDetails = localStorage.getItem("user");
      const userDetail = userDetails ? JSON.parse(userDetails) : null;
      const jwtToken = userDetail ? userDetail.token : null;

      if (jwtToken) {
        
        const newSocket = io(import.meta.env.VITE_APP_BACKEND_PROD_URL, {
          auth: { token: jwtToken },
        });
        setSocket(newSocket);
        return newSocket;
      }
    };

    const newSocket = initSocket();

    return () => newSocket?.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
