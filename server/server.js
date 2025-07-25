const express = require('express');
const connectDB = require("./config/db");
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');


dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow only frontend on Vercel to connect
const allowedOrigins = [
 'https://week-8-capstone-lutty112.vercel.app/',
 'https://week-8-capstone-lutty112.onrender.com/api',
  'http://localhost:5173',
  ];

// CORS for Express
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO events
require('./socket')(io);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect DB and start server
connectDB();

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;

