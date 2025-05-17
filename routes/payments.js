const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const { createPayment, listPayments } = require('../controllers/paymentController');

router.post('/:applicationId', authenticate, requireRole('client'), createPayment);
router.get('/', authenticate, listPayments);

module.exports = router;