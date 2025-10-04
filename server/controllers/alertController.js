// server/controllers/alertController.js
const Alert = require("../models/Alert");

// POST /api/alerts – Create alert
exports.createAlert = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const alert = await Alert.create({
      user: {
        id: req.user.id,
        username: req.user.username || "Unknown",
      },
      lat,
      lng,
    });
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: "Failed to create alert", details: err.message });
  }
};

// GET /api/alerts/user – Get alerts by logged-in user
exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ "user.id": req.user.id }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};

// GET /api/alerts/all – Get all alerts (responder/admin)
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all alerts" });
  }
};
