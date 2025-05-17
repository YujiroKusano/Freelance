const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.listFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(favorites);
  } catch (err) {
    handleError(res, err);
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_projectId: { userId, projectId }
      },
      update: {},
      create: { userId, projectId }
    });
    res.json(favorite);
  } catch (err) {
    handleError(res, err);
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = Number(req.params.projectId);
    await prisma.favorite.delete({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });
    res.json({ message: 'お気に入りを解除しました' });
  } catch (err) {
    handleError(res, err);
  }
};