require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const connectDB = require("./server/config/db");

const authRoutes = require("./server/routes/auth");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use("/api/auth", authRoutes);

// Render frontend
app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});


// Register socket handlers
require("./server/socket")(io);

// Start server **after MongoDB connection**
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit app on failure
  });