// ===================== Importaciones =====================
const { Op } = require('sequelize');
const { Venue, User, VenueAssistance } = require('../models');
const { ROLES, canManageVenue } = require('../middlewares/authMiddlewares');

const userAttributes = ['id', 'full_name', 'email'];
const venueAttributes = ['id', 'name', 'description', 'beginning', 'ending', 'province', 'locality', 'address', 'image'];

// ===================== Controladores =====================

// POST /api/assistance   body: { venue_id }
// El usuario que asiste sale del token (req.user), así nadie puede anotar a otro.
const registerAssistance = async (req, res) => {
    const { venue_id } = req.body;

    try {
        if (!venue_id || isNaN(venue_id))
            return res.status(400).json({ message: 'Falta el id del evento (venue_id)' });

        const event = await Venue.findByPk(venue_id);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

        if (new Date(event.ending) < new Date(new Date().toDateString()))
            return res.status(400).json({ message: 'El evento ya finalizó' });

        const exists = await VenueAssistance.findOne({ where: { venue_id, user_id: req.user.id } });
        if (exists) return res.status(409).json({ message: 'Ya registraste tu asistencia a este evento' });

        const assistance = await VenueAssistance.create({ venue_id, user_id: req.user.id });

        return res.status(201).json({ status: 'success', message: 'Asistencia registrada', id: assistance.id });
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError')
            return res.status(400).json({ message: 'El evento indicado no existe' });
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// DELETE /api/assistance/:venue_id   -> el usuario cancela su asistencia
const cancelAssistance = async (req, res) => {
    try {
        const deleted = await VenueAssistance.destroy({
            where: { venue_id: req.params.venue_id, user_id: req.user.id },
        });
        if (!deleted) return res.status(404).json({ message: 'No estabas registrado en este evento' });

        return res.json({ status: 'success', message: 'Asistencia cancelada' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/ev_assistance/:venue_id  y  GET /api/attendance_getByEvent/:venue_id
// Lista de usuarios que asistirán a un evento (organizador dueño o admin)
const getAssistanceByEvent = async (req, res) => {
    try {
        if (isNaN(req.params.venue_id)) return res.status(400).json({ message: 'El id tiene que ser un número' });

        const event = await Venue.findByPk(req.params.venue_id);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
        if (!canManageVenue(req.user, event))
            return res.status(403).json({ message: 'No podés ver los asistentes de un evento que no es tuyo' });

        const assistance = await VenueAssistance.findAll({
            where: { venue_id: event.id },
            include: [{ model: User, as: 'user', attributes: userAttributes }],
        });

        // Se devuelve directamente la lista de usuarios, como pide el contrato
        return res.json(assistance.filter((a) => a.user).map((a) => a.user));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/attendance_get
// Todos los registros de asistencia. El admin ve todos, el organizador solo los de sus eventos.
const getAllAssistance = async (req, res) => {
    try {
        const venueWhere = req.user.type_users_id === ROLES.ADMIN ? {} : { user_id: req.user.id };

        const assistance = await VenueAssistance.findAll({
            include: [
                { model: User, as: 'user', attributes: userAttributes },
                { model: Venue, as: 'venue', attributes: ['id', 'name'], where: venueWhere, required: true },
            ],
            order: [['id', 'ASC']],
        });

        return res.json(assistance.map((a) => ({ id: a.id, usuario: a.user, evento: a.venue })));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/attendance_getByUser           -> agenda del usuario logueado
// GET /api/attendance_getByUser/:user_id  -> agenda de otro usuario (solo admin)
const getAssistanceByUser = async (req, res) => {
    const userId = req.params.user_id ? Number(req.params.user_id) : req.user.id;

    try {
        if (isNaN(userId)) return res.status(400).json({ message: 'El id tiene que ser un número' });
        if (userId !== req.user.id && req.user.type_users_id !== ROLES.ADMIN)
            return res.status(403).json({ message: 'Solo podés ver tus propios eventos' });

        const { proximos } = req.query; // ?proximos=true -> solo los que todavía no terminaron
        const venueWhere = proximos === 'true' ? { ending: { [Op.gte]: new Date() } } : {};

        const assistance = await VenueAssistance.findAll({
            where: { user_id: userId },
            include: [{ model: Venue, as: 'venue', attributes: venueAttributes, where: venueWhere, required: true }],
        });

        const events = assistance
            .map((a) => a.venue)
            .sort((a, b) => new Date(a.beginning) - new Date(b.beginning));

        return res.json(events);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    registerAssistance, cancelAssistance, getAssistanceByEvent, getAllAssistance, getAssistanceByUser,
};
