const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { setup2FA, verify2FA } = require('../controllers/twoFAController');

router.post('/setup', authenticate, setup2FA);
router.post('/verify', authenticate, verify2FA);

module.exports = router;