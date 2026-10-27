// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/userControllers');
const { auth } = require('../middlewares/authMiddlewares');
 
router.post('/register', register);
router.post('/login', login);
 
// Ruta de prueba para verificar que el middleware auth funciona
router.get('/profile', auth, (req, res) => res.json(req.user));
 
module.exports = router;
