const Device = require('../models/Device');
const locationService = require('../services/locationService');
const logger = require('../utils/logger');
const Joi = require('joi');

/**
 * ===============================
 *  Device Controller
 * ===============================
 */

/**
 * @desc Register a new device with metadata
 * @route POST /api/devices/register
 * @access Public (or protected via JWT)
 */
exports.registerDevice = async (req, res) => {
  try {
    // ✅ Validate incoming request
    const schema = Joi.object({
      deviceId: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { deviceId, name, type } = req.body;

    // ✅ Check if device already exists
    let existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      return res.status(409).json({ error: 'Device already registered' });
    }

    // ✅ Register new device
    const newDevice = new Device({
      deviceId,
      name,
      type,
      lastLocation: null,
      lastUpdated: null,
    });
    await newDevice.save();

    logger.info(`✅ Registered new device: ${deviceId}`);
    res.status(201).json({ success: true, device: newDevice });
  } catch (err) {
    logger.error(`❌ Error registering device: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @desc Update device location (lat, lng, timestamp)
 * @route POST /api/devices/update-location
 * @access Protected (JWT)
 */
exports.updateLocation = async (req, res) => {
  try {
    const schema = Joi.object({
      deviceId: Joi.string().required(),
      lat: Joi.number().required(),
      lng: Joi.number().required(),
      timestamp: Joi.date().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { deviceId, lat, lng, timestamp } = req.body;

    // ✅ Save location + update device record + emit socket event
    const updatedDevice = await locationService.saveLocationUpdate({
      deviceId,
      lat,
      lng,
      timestamp,
    });

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      device: updatedDevice,
    });
  } catch (err) {
    logger.error(`❌ Error updating location: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @desc Get all registered devices
 * @route GET /api/devices
 * @access Protected (JWT)
 */
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await locationService.getAllDevices();
    res.status(200).json({ success: true, count: devices.length, devices });
  } catch (err) {
    logger.error(`❌ Error fetching devices: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @desc Get location history for a specific device
 * @route GET /api/devices/:id/history
 * @access Protected (JWT)
 */
exports.getDeviceHistory = async (req, res) => {
  try {
    const { id: deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    const history = await locationService.getLocationHistory(deviceId);
    res.status(200).json({
      success: true,
      count: history.length,
      deviceId,
      history,
    });
  } catch (err) {
    logger.error(` Error fetching history for ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
