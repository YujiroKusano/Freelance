const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireAdmin = require('../middlewares/adminOnly');
const { createAnnouncement, listAnnouncements } = require('../controllers/announcementController');

router.post('/', authenticate, requireAdmin, createAnnouncement);
router.get('/', authenticate, listAnnouncements);

module.exports = router;