const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Parser } = require('json2csv');
const { handleError } = require('../utils/errorHandler');

exports.exportProjectsCsv = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { clientId: req.user.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    const data = projects.map(p => ({
      title: p.title,
      detail: p.detail,
      category: p.category?.name || '',
      createdAt: p.createdAt
    }));

    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('projects.csv');
    res.send(csv);
  } catch (err) {
    handleError(res, err);
  }
};

exports.exportContractsCsv = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    const contracts = await prisma.application.findMany({
      where: {
        status: 'approved',
        ...(role === 'freelancer' ? { userId } : {}),
        ...(role === 'client' ? { project: { clientId: userId } } : {})
      },
      include: { project: true, user: true },
      orderBy: { approvedAt: 'desc' }
    });

    const data = contracts.map(c => ({
      project: c.project.title,
      freelancer: c.user.name,
      status: c.status,
      approvedAt: c.approvedAt,
      completedAt: c.completedAt,
      canceledAt: c.canceledAt
    }));

    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('contracts.csv');
    res.send(csv);
  } catch (err) {
    handleError(res, err);
  }
};