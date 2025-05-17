const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { getMessages, sendMessage } = require('../controllers/messageController');

router.get('/:applicationId', authenticate, getMessages);
router.post('/:applicationId', authenticate, sendMessage);

module.exports = router;