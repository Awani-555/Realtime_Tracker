require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const deviceRoutes = require('./routes/devices');
const socketService = require('./services/socketService');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.static("public"));
// Connect MongoDB
connectDB();

// API Routes
app.use('/api/devices', deviceRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Realtime Tracker Backend is running...');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (fallback)
app.use((err, req, res, next) => {
  logger.error(` Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Create HTTP + Socket.io server
const server = http.createServer(app);

// Initialize Socket.io for real-time updates
const io = new Server(server, {
  cors: {
    origin: '*', // Change to dashboard URL in production
    methods: ['GET', 'POST'],
  },
});

socketService.initialize(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(` Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(` Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
