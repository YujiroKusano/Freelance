const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

// 実際は.env などで設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1時間有効

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: expires }
    });

    const resetUrl = `https://yourapp.com/reset-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'パスワード再設定リンク',
      text: `以下のURLからパスワードを再設定してください: ${resetUrl}`
    });

    res.json({ message: 'リセットメールを送信しました' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const reset = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!reset || reset.expiresAt < new Date()) return res.status(400).json({ error: '無効または期限切れトークン' });

    await prisma.user.update({
      where: { id: reset.userId },
      data: { password } // ハッシュ化は別処理で行うこと
    });

    await prisma.passwordResetToken.delete({ where: { token } });
    res.json({ message: 'パスワードを更新しました' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;