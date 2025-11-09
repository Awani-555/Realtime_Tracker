const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.issueToken = (req, res) => {
  const { type, id } = req.body;
  if (!type || !id) return res.status(400).json({ error: 'type and id required' });
  const token = jwt.sign({ type, id }, secret, { expiresIn: '12h' });
  res.json({ token });
};
