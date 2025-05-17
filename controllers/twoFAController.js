const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

exports.setup2FA = async (req, res) => {
  const secret = speakeasy.generateSecret({ name: `FreelancePlatform (${req.user.email})` });
  await prisma.user.update({ where: { id: req.user.id }, data: { twoFASecret: secret.base32 } });
  const qr = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qr });
};

exports.verify2FA = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token: req.body.token
  });
  res.json({ verified });
};