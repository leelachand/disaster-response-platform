// index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const apiRoutes = require('./api');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: '*', // ✅ Allow frontend (e.g., React) to connect
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach routes
app.use('/api', apiRoutes);

// Setup socket instance on the app object
app.set('socketio', io);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('📡 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
