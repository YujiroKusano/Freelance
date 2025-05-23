const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { generateTokens } = require('../utils/jwt');

// サインアップ・ログイン
router.post('/signup', signup);
router.post('/login', login);

// リフレッシュトークンによるアクセストークン再発行
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { accessToken, refreshToken: newRefresh } = generateTokens(user);
    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
