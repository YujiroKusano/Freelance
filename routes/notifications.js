const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { listNotifications, markNotificationAsRead } = require('../controllers/notificationController');

router.get('/', authenticate, listNotifications);
router.patch('/:id/read', authenticate, markNotificationAsRead);

module.exports = router;