const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { handleError } = require('../utils/errorHandler');

exports.createReview = async (req, res) => {
  try {
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        projectId: Number(req.params.projectId),
        rating: req.body.rating,
        comment: req.body.comment
      }
    });
    res.status(201).json(review);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getProjectReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { projectId: Number(req.params.projectId) },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (err) {
    handleError(res, err);
  }
};