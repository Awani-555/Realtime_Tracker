const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { verifyToken } = require('../utils/validator'); // JWT middleware

/**
 * ===============================
 * Device Routes
 * ===============================
 */

// @route   POST /api/devices/register
// @desc    Register a new device
// @access  Public (could be protected in prod)
router.post('/register', deviceController.registerDevice);

// @route   POST /api/devices/update-location
// @desc    Update device location (lat, lng, timestamp)
// @access  Protected (JWT)
//router.post('/update-location', verifyToken, deviceController.updateLocation);
router.post('/update-location', deviceController.updateLocation);
// @route   GET /api/devices
// @desc    Get all registered devices
// @access  Protected (JWT)
router.get('/', verifyToken, deviceController.getAllDevices);

// @route   GET /api/devices/:id/history
// @desc    Get location history of a specific device
// @access  Protected (JWT)
router.get('/:id/history', verifyToken, deviceController.getDeviceHistory);

module.exports = router;
