const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', authenticate, async (req, res) => {
  try {
    const { reportedId, reason } = req.body;
    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        reportedId,
        reason
      }
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: '権限がありません' });
  const reports = await prisma.report.findMany({
    include: {
      reporter: true,
      reported: true
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(reports);
});

router.patch('/:id/suspend', authenticate, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: '権限がありません' });
  const report = await prisma.report.update({
    where: { id: Number(req.params.id) },
    data: { status: 'suspended' }
  });
  await prisma.user.update({
    where: { id: report.reportedId },
    data: { isSuspended: true }
  });
  res.json({ message: 'ユーザーを凍結しました' });
});

module.exports = router;