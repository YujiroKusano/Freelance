module.exports = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: '管理者のみ操作可能です' });
  }
  next();
};