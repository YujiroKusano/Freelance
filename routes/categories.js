const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireAdmin = require('../middlewares/adminOnly');
const { getCategories, createCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', authenticate, requireAdmin, createCategory);

module.exports = router;