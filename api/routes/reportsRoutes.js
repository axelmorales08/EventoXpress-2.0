// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const { eventsReport, attendanceReport } = require('../controllers/reportsControllers');
const { auth, isOrganizer } = require('../middlewares/authMiddlewares');

router.get('/reports/events', auth, isOrganizer, eventsReport);
router.get('/reports/attendance', auth, isOrganizer, attendanceReport);

module.exports = router;
