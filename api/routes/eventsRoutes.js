// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const {
    getEvents, getEventById, createEvent, updateEvent, deleteEvent, filterEvents,
} = require('../controllers/eventsControllers');
const { auth, isOrganizer } = require('../middlewares/authMiddlewares');

// Públicas: cualquiera puede ver y buscar eventos
router.get('/ev_info', getEvents);
router.get('/events_getById/:id', getEventById);
router.get('/fil_ev', filterEvents);

// Organizador / admin
router.post('/ev_post', auth, isOrganizer, createEvent);
router.put('/ev_mody/:id', auth, isOrganizer, updateEvent);
router.patch('/ev_mody/:id', auth, isOrganizer, updateEvent);
router.delete('/ev_del/:id', auth, isOrganizer, deleteEvent);

module.exports = router;
