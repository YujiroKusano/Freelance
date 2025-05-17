const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.applyToProject = async (req, res) => {
  try {
    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        projectId: req.body.projectId,
        status: 'applied'
      }
    });
    res.status(201).json(application);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (err) {
    handleError(res, err);
  }
};

exports.listApplicants = async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { status, keyword } = req.query;

  try {
    const filters = {
      projectId,
      ...(status ? { status } : {})
    };

    const applicants = await prisma.application.findMany({
      where: filters,
      include: {
        user: {
          where: keyword
            ? {
                OR: [
                  { name: { contains: keyword, mode: 'insensitive' } },
                  { email: { contains: keyword, mode: 'insensitive' } }
                ]
              }
            : undefined
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(applicants);
  } catch (err) {
    handleError(res, err);
  }
};
