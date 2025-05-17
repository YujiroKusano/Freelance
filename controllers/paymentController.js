const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.createPayment = async (req, res) => {
  try {
    const applicationId = Number(req.params.applicationId);

    const payment = await prisma.payment.create({
      data: {
        applicationId,
        amount: 100000, // 仮の金額
        status: 'paid'
      }
    });

    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: 'payment',
        content: `契約 ${applicationId} に対する支払いが完了しました`
      }
    });

    res.json(payment);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listPayments = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: role === 'client' ? {
        application: {
          project: {
            clientId: userId
          }
        }
      } : {
        application: {
          userId
        }
      },
      include: {
        application: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (err) {
    handleError(res, err);
  }
};