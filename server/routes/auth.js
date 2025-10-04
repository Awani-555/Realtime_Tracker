const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🟡 Added input validation function
const validateUserInput = (username, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordMinLength = 6;

  if (!username || !emailRegex.test(username)) {
    return "Username must be a valid email address.";
  }
  if (!password || password.length < passwordMinLength) {
    return `Password must be at least ${passwordMinLength} characters long.`;
  }
  return null;
};

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    // 🟡 Added role field with default fallback
    const { username, password, role = "user" } = req.body;

    const validationError = validateUserInput(username, password);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // 🟡 Save role to database
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 🟡 JWT now includes role for RBAC
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

module.exports = router;
