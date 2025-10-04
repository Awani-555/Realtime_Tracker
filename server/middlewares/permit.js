
// 🟢 More flexible than single-role checks
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: insufficient role" });
    }
    next();
  };
};
