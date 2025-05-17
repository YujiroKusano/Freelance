const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.uploadFile = async (req, res) => {
  try {
    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.originalname,
        url: '/uploads/' + req.file.filename,
        projectId: Number(req.params.projectId),
        uploadedBy: req.user.id
      }
    });
    res.status(201).json(attachment);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listAttachments = async (req, res) => {
  try {
    const attachments = await prisma.attachment.findMany({
      where: { projectId: Number(req.params.projectId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(attachments);
  } catch (err) {
    handleError(res, err);
  }
};