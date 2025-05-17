const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        applications: { include: { project: true } },
        projects: true
      }
    });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
};
