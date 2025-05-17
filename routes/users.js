const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getMe } = require('../controllers/userController');

router.get('/me', authenticate, getMe);

module.exports = router;