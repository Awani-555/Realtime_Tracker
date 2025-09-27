// server/socket.js
const jwt = require("jsonwebtoken");

const registerSocketHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId);

    socket.on("send-location", (data) => {
      const { latitude, longitude } = data;

      // You can now use socket.userId here
      io.emit("receive-location", {
        id: socket.userId,
        latitude,
        longitude
      });
    });

    socket.on("disconnect", () => {
      io.emit("user-disconnected", socket.userId);
    });
  });
};

module.exports = registerSocketHandlers;
