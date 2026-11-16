const express = require('express');
const router = express.Router();

const {
    createAuthorization, getAuthorizations, updateAuthorization,
} = require('../controllers/ownerAuthControllers');
const { auth } = require('../middlewares/authMiddlewares');

router.post('/autorizacion-dueno', auth, createAuthorization);
router.get('/autorizacion-dueno', auth, getAuthorizations);
router.put('/autorizacion-dueno/:id', auth, updateAuthorization);
router.patch('/autorizacion-dueno/:id', auth, updateAuthorization);

module.exports = router;