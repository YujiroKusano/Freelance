const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'ユーザーが見つかりません' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.emailVerificationToken.create({
      data: { userId: user.id, token, expiresAt }
    });

    const url = `https://yourapp.com/verify-email/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'メール認証リンク',
      text: `以下のリンクからメールアドレスを認証してください: ${url}`
    });

    res.json({ message: '認証リンクを送信しました' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) return res.status(400).json({ error: '無効なトークンです' });

    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true }
    });

    await prisma.emailVerificationToken.delete({ where: { token } });
    res.json({ message: 'メールアドレスを確認しました' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;