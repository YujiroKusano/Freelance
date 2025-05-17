const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const { listProjects, createProject } = require('../controllers/projectController');

router.get('/', listProjects); // 誰でも取得可能
router.post('/', authenticate, requireRole('client'), createProject); // クライアントのみ投稿可能

module.exports = router;