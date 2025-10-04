// server/middleware/requireRole.js
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }
    next();
  };
};

module.exports = requireRole;
