const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function logLogin(req, res, next) {
  if (req.user) {
    await prisma.loginLog.create({
      data: {
        userId: req.user.id,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || ''
      }
    });
  }
  next();
};