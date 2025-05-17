const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const { exportProjectsCsv, exportContractsCsv } = require('../controllers/exportController');

router.get('/projects', authenticate, requireRole('client'), exportProjectsCsv);
router.get('/contracts', authenticate, exportContractsCsv);

module.exports = router;