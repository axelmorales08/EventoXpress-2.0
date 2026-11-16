// ===================== Importaciones =====================
const { Notification, User, Venue, VenueAssistance } = require('../models');
const { ROLES, canManageVenue } = require('../middlewares/authMiddlewares');

// ===================== Controladores =====================

// POST /api/notifications   (organizador o admin)
// Se puede mandar de 3 formas:
//   { venue_id, title, message }  -> a todos los asistentes de ese evento (dueño del evento o admin)
//   { user_id,  title, message }  -> a un usuario puntual (solo admin)
//   { all: true, title, message } -> a todos los usuarios (solo admin)
const sendNotification = async (req, res) => {
    const { user_id, venue_id, all, title, message } = req.body;
    const isAdminUser = req.user.type_users_id === ROLES.ADMIN;

    try {
        if (!title || !message) return res.status(400).json({ message: 'Faltan el título o el mensaje' });
        if (String(title).length > 100) return res.status(400).json({ message: 'El título no puede superar los 100 caracteres' });
        if (!user_id && !venue_id && !all)
            return res.status(400).json({ message: 'Indicá a quién va dirigida (user_id, venue_id o all)' });

        let recipients = [];
        let venueId = null;

        if (venue_id) {
            const event = await Venue.findByPk(venue_id);
            if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
            if (!canManageVenue(req.user, event))
                return res.status(403).json({ message: 'Solo podés notificar a los asistentes de tus eventos' });

            const assistance = await VenueAssistance.findAll({ where: { venue_id }, attributes: ['user_id'] });
            recipients = assistance.map((a) => a.user_id);
            venueId = event.id;
        } else if (user_id) {
            if (!isAdminUser) return res.status(403).json({ message: 'Solo un administrador puede notificar a un usuario puntual' });
            const user = await User.findByPk(user_id);
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
            recipients = [user.id];
        } else {
            if (!isAdminUser) return res.status(403).json({ message: 'Solo un administrador puede notificar a todos' });
            const users = await User.findAll({ attributes: ['id'] });
            recipients = users.map((u) => u.id);
        }

        if (recipients.length === 0)
            return res.status(400).json({ message: 'No hay destinatarios para esta notificación' });

        await Notification.bulkCreate(
            [...new Set(recipients)].map((id) => ({
                user_id: id,
                venue_id: venueId,
                title: String(title).trim(),
                message: String(message).trim(),
            }))
        );

        return res.status(201).json({
            status: 'success',
            message: 'Notificación enviada',
            enviadas: new Set(recipients).size,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/notifications   -> notificaciones del usuario logueado (opcional: ?unread=true)
const getNotifications = async (req, res) => {
    try {
        const where = { user_id: req.user.id };
        if (req.query.unread === 'true') where.is_read = false;

        const notifications = await Notification.findAll({
            where,
            include: [{ model: Venue, as: 'venue', attributes: ['id', 'name'] }],
            order: [['created_at', 'DESC']],
        });

        const unread = await Notification.count({ where: { user_id: req.user.id, is_read: false } });

        return res.json({ status: 'success', no_leidas: unread, notificaciones: notifications });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/notifications/:id/read   -> marcar una notificación como leída
const markAsRead = async (req, res) => {
    try {
        const [updated] = await Notification.update(
            { is_read: true },
            { where: { id: req.params.id, user_id: req.user.id } }
        );
        if (updated === 0) return res.status(404).json({ message: 'Notificación no encontrada' });

        return res.json({ status: 'success', message: 'Notificación marcada como leída' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/notifications/read_all   -> marcar todas como leídas
const markAllAsRead = async (req, res) => {
    try {
        const [updated] = await Notification.update(
            { is_read: true },
            { where: { user_id: req.user.id, is_read: false } }
        );
        return res.json({ status: 'success', message: 'Notificaciones marcadas como leídas', actualizadas: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { sendNotification, getNotifications, markAsRead, markAllAsRead };
