const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getDashboardData } = require('../controllers/dashboardController');

router.get('/', authenticate, getDashboardData);

module.exports = router;