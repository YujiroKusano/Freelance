const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const { listProjects, createProject } = require('../controllers/projectController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cache = require('../utils/cache');

// 通常取得（全件 or 絞り込み）
router.get('/', listProjects);

// 案件作成（クライアントのみ）
router.post('/', authenticate, requireRole('client'), createProject);

// 軽量取得（モバイル向け・キャッシュ付き）
router.get('/compact', async (req, res) => {
  const cacheKey = 'compact_project_list';

  try {
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        client: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    await cache.set(cacheKey, JSON.stringify(projects), { EX: 60 }); // 60秒キャッシュ
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
