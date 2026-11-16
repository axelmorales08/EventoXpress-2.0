const express = require('express');
const router = express.Router();
const favControllers = require('../controllers/favoritesControllers');
const { auth } = require('../middlewares/authMiddlewares');

router.get('/favorites', auth, favControllers.getFavorites);
router.post('/favorite', auth, favControllers.addFavorite);
router.delete('/desfavorite', auth, favControllers.removeFavorite);

module.exports = router;
