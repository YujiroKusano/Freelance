const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (err) {
    handleError(res, err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        name: req.body.name
      }
    });
    res.status(201).json(category);
  } catch (err) {
    handleError(res, err);
  }
};