// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const {
    registerAssistance, cancelAssistance, getAssistanceByEvent, getAllAssistance, getAssistanceByUser,
} = require('../controllers/assistanceControllers');
const { auth, isOrganizer } = require('../middlewares/authMiddlewares');

// Consumidor
router.post('/assistance', auth, registerAssistance);
router.delete('/assistance/:venue_id', auth, cancelAssistance);
router.get('/attendance_getByUser', auth, getAssistanceByUser);
router.get('/attendance_getByUser/:user_id', auth, getAssistanceByUser);

// Organizador / admin
router.get('/ev_assistance/:venue_id', auth, isOrganizer, getAssistanceByEvent);
router.get('/attendance_getByEvent/:venue_id', auth, isOrganizer, getAssistanceByEvent);
router.get('/attendance_get', auth, isOrganizer, getAllAssistance);

module.exports = router;
