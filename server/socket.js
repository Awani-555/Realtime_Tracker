const jwt = require('jsonwebtoken');
const Alert = require('./models/Alert');

const socketIO = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Middleware: verify token before allowing socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to socket
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(` ${socket.user.username} connected via socket`);

    // Receive and optionally broadcast user location
    socket.on('send-location', (data) => {
      io.emit('receive-location', {
        id: socket.id,
        username: socket.user.username,
        latitude: data.latitude,
        longitude: data.longitude
      });
    });

    // 🚨 Emergency Alert (with logging + role check)
    socket.on('emergencyAlert', async (data) => {
      const { lat, lng } = data;

      // Only allow 'user' or 'responder' roles to send alerts
      if (!['user', 'responder', 'admin'].includes(socket.user.role)) {
        console.log(" Unauthorized alert attempt");
        return;
      }

      const alertData = {
        user: {
          id: socket.user.id,
          username: socket.user.username
        },
        lat,
        lng
      };

      //Store alert in DB
      await new Alert(alertData);

      // Broadcast to all other clients
      socket.broadcast.emit('receiveEmergencyAlert', alertData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔴 ${socket.user.username} disconnected`);
      io.emit('user-disconnected', socket.id);
    });
  });
};

module.exports = socketIO;
