import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});

  const login = async (email, password) => {
    try {
      const res = await axios.post('https://week-8-capstone-lutty112.onrender.com/api/auth/login', { email, password });
      const { user, token } = res.data;
      console.log('Login response:', { user, token });
      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      console.log('Saved to localStorage:', { user, token });
      return user;
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (socket) socket.disconnect();
    setSocket(null);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Initial user from localStorage:', storedUser);
    console.log('Current user state:', user);

    if (user?._id) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId: user._id, username: user.fullName },
      });
      setSocket(newSocket);

      newSocket.on('online-users', (users) => {
        setOnlineUsers(users);
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
        socket,
        onlineUsers,
        typingStatus,
        setTypingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

