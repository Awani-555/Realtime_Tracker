const logger = require('../utils/logger');

let ioInstance; // socket.io server reference

/**
 * Initialize Socket.io service
 */
exports.initialize = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    logger.info(`🔌 New socket connected: ${socket.id}`);

    // Handle client joining a specific room (device/dashboard)
    socket.on('join', (room) => {
      socket.join(room);
      logger.info(`📡 Socket ${socket.id} joined room: ${room}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emit location update to all connected dashboards
 */
exports.emitLocationUpdate = (deviceId, data) => {
  if (!ioInstance) {
    logger.error(' Socket.io instance not initialized');
    return;
  }

  // Emit to all connected clients (or to a specific room)
  ioInstance.emit('locationUpdate', data);

  // Optionally: send to room-specific clients
  // ioInstance.to(deviceId).emit('locationUpdate', data);

  logger.info(`Emitted location update for device ${deviceId}`);
};
