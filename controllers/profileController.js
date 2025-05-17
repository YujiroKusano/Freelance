const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: req.body.name,
        bio: req.body.bio
      }
    });
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
};