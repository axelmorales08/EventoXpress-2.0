// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const {
    register, login, info, modify,
    usersGet, usersMody, usersRole, usersStatus
} = require('../controllers/userControllers');
const { auth, isAdmin } = require('../middlewares/authMiddlewares');

router.post('/register', register);
router.post('/login', login);


//propio
router.get('/info', auth, info);
router.patch('/modify', auth, modify);


//admin
router.get('/users_get', auth, isAdmin, usersGet);
router.patch('/users_status/:id', auth, isAdmin, usersStatus);
router.patch('/users_mody/:id', auth, isAdmin, usersMody);
router.patch('/users_role/:id', auth, isAdmin, usersRole);

// Ruta de prueba para verificar que el middleware auth funciona
router.get('/profile', auth, (req, res) => res.json(req.user));

module.exports = router;
