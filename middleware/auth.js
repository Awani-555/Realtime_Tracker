const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.device = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const payload = jwt.verify(token, secret);
    if (payload.type !== 'device') throw new Error();
    req.device = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.dashboard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  try {
    const payload = jwt.verify(token, secret);
    if (payload.type !== 'dashboard') throw new Error();
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
