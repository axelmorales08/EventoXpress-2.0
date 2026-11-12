const express = require('express');
const router = express.Router();
const favControllers = require('../controllers/favoritesControllers');

router.post('/favorite', favControllers.addFavorite);
router.delete('/desfavorite', favControllers.removeFavorite);

module.exports = router;