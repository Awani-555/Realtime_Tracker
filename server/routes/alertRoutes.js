// server/routes/alertRoutes.js
const express = require("express");
const router = express.Router();

const {
  createAlert,
  getUserAlerts,
  getAllAlerts,
} = require("../controllers/alertController");

const verifyToken = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

// Routes

// POST - citizen/responder can send alert
router.post("/", verifyToken, createAlert);

// GET - user gets their own alerts
router.get("/user", verifyToken, getUserAlerts);

// GET - only responder/admin can view all alerts
router.get("/all", verifyToken, requireRole("responder"), getAllAlerts);

module.exports = router;
