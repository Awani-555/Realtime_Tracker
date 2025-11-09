const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: String,
  type: String,
  lastLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date
  },
  lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
