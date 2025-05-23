const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const authenticate = require('../middlewares/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// QRコード生成と秘密鍵保存
router.get('/setup', authenticate, async (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20, name: `FreelanceApp (${req.user.email})` });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { twoFASecret: secret.base32 }
  });

  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) return res.status(500).json({ error: 'QR生成失敗' });
    res.json({ qrCode: data_url });
  });
});

// 2FAコードの検証
router.post('/verify', authenticate, async (req, res) => {
  const { token } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user.twoFASecret) return res.status(400).json({ error: '2FA未設定です' });

  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token
  });

  if (!verified) return res.status(401).json({ error: '無効な認証コード' });

  res.json({ message: '2FA認証成功' });
});

module.exports = router;