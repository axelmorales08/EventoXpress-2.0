// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const {
    register, login, adminLogin, adminVerify, organizerRequestCode, organizerVerifyCode,
    recoverPassword, resetPassword, authVerify, info, modify,
    usersGet, usersGetById, usersMody, usersRole, usersStatus
} = require('../controllers/userControllers');
const { auth, isAdmin } = require('../middlewares/authMiddlewares');

router.post('/register', register);
router.post('/login', login);
router.post('/admin_login', adminLogin);
router.post('/admin_verify', adminVerify);
router.post('/organizer/request_code', organizerRequestCode);
router.post('/organizer/verify_code', organizerVerifyCode);
router.post('/recover_password', recoverPassword);
router.post('/reset_password', resetPassword);
router.get('/auth_verify', auth, authVerify);


//propio
router.get('/info', auth, info);
router.patch('/modify', auth, modify);


//admin
router.get('/users_get', auth, isAdmin, usersGet);
router.get('/users_getById/:id', auth, isAdmin, usersGetById);
router.patch('/users_status/:id', auth, isAdmin, usersStatus);
router.patch('/users_mody/:id', auth, isAdmin, usersMody);
router.patch('/users_role/:id', auth, isAdmin, usersRole);

// Ruta de prueba para verificar que el middleware auth funciona
router.get('/profile', auth, (req, res) => res.json(req.user));

module.exports = router;
