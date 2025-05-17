const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { createReview, getProjectReviews } = require('../controllers/reviewController');

router.post('/:projectId', authenticate, createReview);
router.get('/:projectId', getProjectReviews);

module.exports = router;