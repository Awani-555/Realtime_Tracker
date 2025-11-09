const jwt = require('jsonwebtoken');
const logger = require('./logger');

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error(`❌ Invalid token: ${err.message}`);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
