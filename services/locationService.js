const Device = require('../models/Device');
const Location = require('../models/Location');
const socketService = require('./socketService');
const logger = require('../utils/logger');

/**
 * Save a location update for a device
 */
exports.saveLocationUpdate = async ({ deviceId, lat, lng, timestamp }) => {
  try {
    const ts = timestamp ? new Date(timestamp) : new Date();

    // Save location to history collection
    await Location.create({ deviceId, lat, lng, timestamp: ts });

    // Update device’s last known location
    const updatedDevice = await Device.findOneAndUpdate(
      { deviceId },
      { lastLocation: { lat, lng, timestamp: ts }, lastUpdated: ts },
      { upsert: true, new: true }
    );

    // Emit socket event for dashboards
    socketService.emitLocationUpdate(deviceId, { deviceId, lat, lng, timestamp: ts });

    logger.info(`📍 Location updated for device ${deviceId}`);
    return updatedDevice;
  } catch (error) {
    logger.error(`❌ Error saving location for ${deviceId}: ${error.message}`);
    throw error;
  }
};

/**
 * Fetch location history for a given device
 */
exports.getLocationHistory = async (deviceId, limit = 1000) => {
  try {
    return await Location.find({ deviceId })
      .sort({ timestamp: 1 })
      .limit(limit)
      .lean();
  } catch (error) {
    logger.error(`❌ Error fetching history for ${deviceId}: ${error.message}`);
    throw error;
  }
};

/**
 * List all devices with their last known locations
 */
exports.getAllDevices = async () => {
  try {
    return await Device.find({}).lean();
  } catch (error) {
    logger.error(` Error fetching devices: ${error.message}`);
    throw error;
  }
};
