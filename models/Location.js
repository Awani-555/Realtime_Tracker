const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true },
  lat: Number,
  lng: Number,
  timestamp: Date
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);
