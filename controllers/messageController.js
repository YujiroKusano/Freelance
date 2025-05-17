const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.getMessages = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { applicationId: Number(applicationId) },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (err) {
    handleError(res, err);
  }
};

exports.sendMessage = async (req, res) => {
  const { applicationId } = req.params;
  const { content } = req.body;
  const senderId = req.user.id;
  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        applicationId: Number(applicationId)
      }
    });
    res.json(message);
  } catch (err) {
    handleError(res, err);
  }
};