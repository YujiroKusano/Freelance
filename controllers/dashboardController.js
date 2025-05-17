const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.getDashboardData = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    if (role === 'client') {
      const projects = await prisma.project.count({ where: { clientId: userId } });
      const applications = await prisma.application.count({ where: { project: { clientId: userId } } });
      const contracts = await prisma.application.count({ where: { status: 'approved', project: { clientId: userId } } });
      const payments = await prisma.payment.count({ where: { application: { project: { clientId: userId } } } });

      res.json({ role, projects, applications, contracts, payments });
    } else {
      const applications = await prisma.application.count({ where: { userId } });
      const contracts = await prisma.application.count({ where: { status: 'approved', userId } });
      const payments = await prisma.payment.count({ where: { application: { userId } } });
      const reviews = await prisma.review.count({ where: { userId } });

      res.json({ role, applications, contracts, payments, reviews });
    }
  } catch (err) {
    handleError(res, err);
  }
};