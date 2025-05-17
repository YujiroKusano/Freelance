const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.approveApplication = async (req, res) => {
  try {
    const id = Number(req.params.applicationId);
    const application = await prisma.application.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'contract',
        content: 'あなたの応募が承認されました'
      }
    });

    res.json(application);
  } catch (err) {
    handleError(res, err);
  }
};

exports.completeContract = async (req, res) => {
  try {
    const id = Number(req.params.applicationId);
    const application = await prisma.application.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'contract',
        content: '契約が完了しました'
      }
    });

    res.json(application);
  } catch (err) {
    handleError(res, err);
  }
};

exports.cancelContract = async (req, res) => {
  try {
    const id = Number(req.params.applicationId);
    const application = await prisma.application.update({
      where: { id },
      data: {
        status: 'canceled',
        canceledAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'contract',
        content: '契約がキャンセルされました'
      }
    });

    res.json(application);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listContracts = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const contracts = await prisma.application.findMany({
      where: {
        status: 'approved',
        ...(role === 'freelancer' ? { userId } : {}),
        ...(role === 'client' ? { project: { clientId: userId } } : {})
      },
      include: {
        project: true,
        user: true
      },
      orderBy: { approvedAt: 'desc' }
    });

    res.json(contracts);
  } catch (err) {
    handleError(res, err);
  }
};