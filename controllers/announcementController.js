const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, target, userId } = req.body;
    const announcement = await prisma.announcement.create({
      data: { title, message, target, userId: target === 'user' ? userId : null }
    });
    res.status(201).json(announcement);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { target: 'all' },
          { target: 'user', userId: req.user.id }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (err) {
    handleError(res, err);
  }
};