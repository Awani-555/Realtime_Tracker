require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
const authRoutes = require('./routes/auth');
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});
require("../socket")(io);