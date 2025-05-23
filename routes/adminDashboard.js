const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticate = require('../middlewares/auth');

router.get('/summary', authenticate, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: '権限がありません' });

  try {
    const [totalUsers, totalProjects, totalReports, totalContracts] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.report.count(),
      prisma.application.count({ where: { status: 'approved' } })
    ]);

    const latestUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      totalUsers,
      totalProjects,
      totalReports,
      totalContracts,
      latestUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;