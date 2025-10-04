const express = require("express");
const router = express.Router();

const {
  createAlert,
  getUserAlerts,
  getAllAlerts,
} = require("../controllers/alertController");

const verifyToken = require("../middlewares/auth");

// 🟡 Changed from requireRole (single role) to flexible permit
const permit = require("../middlewares/permit");

// POST - citizen/responder can send alert
// 🟡 permit() allows both 'user' and 'responder'
router.post("/", verifyToken, permit("user", "responder"), createAlert);

// GET - user gets their own alerts
router.get("/user", verifyToken, getUserAlerts);

// GET - only responder/admin can view all alerts
// 🟡 permit() accepts multiple roles
router.get("/all", verifyToken, permit("responder", "admin"), getAllAlerts);

module.exports = router;
