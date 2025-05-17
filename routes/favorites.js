const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const { addFavorite, removeFavorite, listFavorites } = require('../controllers/favoriteController');

router.get('/', authenticate, listFavorites);
router.post('/:projectId', authenticate, addFavorite);
router.delete('/:projectId', authenticate, removeFavorite);

module.exports = router;