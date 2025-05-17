const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const requireAdmin = require('../middlewares/adminOnly');
const { listUsers, deleteUser, listProjects, deleteProject } = require('../controllers/adminController');

router.use(authenticate, requireAdmin);

router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

router.get('/projects', listProjects);
router.delete('/projects/:id', deleteProject);

module.exports = router;