module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) {
      return res.status(403).json({ message: `Only ${requiredRole}s can access this endpoint` });
    }
    next();
  };
};