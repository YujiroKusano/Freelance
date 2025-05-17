const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const {
  approveApplication,
  listContracts,
  completeContract,
  cancelContract
} = require('../controllers/contractController');

router.patch('/:applicationId/approve', authenticate, requireRole('client'), approveApplication);
router.get('/', authenticate, listContracts);
router.patch('/:applicationId/complete', authenticate, requireRole('client'), completeContract);
router.patch('/:applicationId/cancel', authenticate, cancelContract);

module.exports = router;