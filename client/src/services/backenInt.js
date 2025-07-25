import axios from 'axios';
import { io } from 'socket.io-client';

const rawURL = import.meta.env.VITE_API_URL || "https://week-8-capstone-lutty112.onrender.com"
const baseURL = rawURL.replace(/\/+$/, '');

// Create axios instance with base configuration
const API = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging and auth
API.interceptors.request.use((config) => {
  console.log('Making API request to:', config.baseURL + config.url);
  
  // Add Authorization header if token exists
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      fullURL: error.config?.baseURL + error.config?.url
    });
    return Promise.reject(error);
  }
);

// Socket.io - use base URL without /api for socket connection
export const socket = io(baseURL, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  maxReconnectionAttempts: 5,
});

// Auth functions
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export default API;