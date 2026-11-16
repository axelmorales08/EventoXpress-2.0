// ===================== Importaciones =====================
const express = require('express');
const router = express.Router();

const {
    sendNotification, getNotifications, markAsRead, markAllAsRead,
} = require('../controllers/notificationsControllers');
const { auth, isOrganizer } = require('../middlewares/authMiddlewares');

router.post('/notifications', auth, isOrganizer, sendNotification);
router.get('/notifications', auth, getNotifications);
// read_all va antes que /:id/read para que no se confundan
router.patch('/notifications/read_all', auth, markAllAsRead);
router.patch('/notifications/:id/read', auth, markAsRead);

module.exports = router;
