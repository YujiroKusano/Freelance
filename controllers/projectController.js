const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.listProjects = async (req, res) => {
  const { search, status, categoryId } = req.query;

  try {
    const filters = {};

    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { detail: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status === 'open') {
      filters.applications = { none: { status: 'approved' } };
    } else if (status === 'filled') {
      filters.applications = { some: { status: 'approved' } };
    }

    if (categoryId) {
      filters.categoryId = Number(categoryId);
    }

    const projects = await prisma.project.findMany({
      where: filters,
      include: {
        client: true,
        category: true,
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  } catch (err) {
    handleError(res, err);
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        title: req.body.title,
        detail: req.body.detail,
        clientId: req.user.id,
        categoryId: req.body.categoryId || null
      }
    });
    res.status(201).json(project);
  } catch (err) {
    handleError(res, err);
  }
};