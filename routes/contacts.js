const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireAdmin = require('../middlewares/adminOnly');
const { submitContact, listContacts, markAsRead, countUnread } = require('../controllers/contactController');

router.post('/', authenticate, submitContact);
router.get('/', authenticate, requireAdmin, listContacts);
router.get('/unread-count', authenticate, requireAdmin, countUnread);
router.patch('/:id/read', authenticate, requireAdmin, markAsRead);

module.exports = router;