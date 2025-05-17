const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function logActivity(userId, action, metadata = null) {
  await prisma.activityLog.create({
    data: { userId, action, metadata }
  });
}

module.exports = { logActivity };