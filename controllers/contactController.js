const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.submitContact = async (req, res) => {
  try {
    const contact = await prisma.contact.create({
      data: {
        userId: req.user.id,
        subject: req.body.subject,
        message: req.body.message
      }
    });
    res.status(201).json(contact);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    res.json(contacts);
  } catch (err) {
    handleError(res, err);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: Number(req.params.id) },
      data: { isRead: true }
    });
    res.json(contact);
  } catch (err) {
    handleError(res, err);
  }
};

exports.countUnread = async (req, res) => {
  try {
    const count = await prisma.contact.count({ where: { isRead: false } });
    res.json({ unreadCount: count });
  } catch (err) {
    handleError(res, err);
  }
};