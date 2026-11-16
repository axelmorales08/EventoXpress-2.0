const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../config/jwt');

// Ids de la tabla type_users (ver config/seeder.js)
const ROLES = {
    ADMIN: 1,
    ORGANIZADOR: 2,
    CONSUMIDOR: 3,
};

const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: 'Tenés que iniciar sesión' });
        }

        const token = header.startsWith('Bearer ') ? header.slice(7) : header;

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        // Los tokens temporales (2º paso del admin, recuperar contraseña) no sirven como sesión
        if (decoded.purpose) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        const user = await User.findByPk(decoded.id);
        if (!user || user.deleted_at) {
            return res.status(401).json({ message: 'No existe el usuario' });
        }

        req.user = {
            id: user.id,
            type_users_id: user.type_users_id,
            full_name: user.full_name,
            user_name: user.user_name,
            email: user.email,
            phone: user.phone,
        };
        next();
    } catch (err) {
        console.error('Error en auth:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const ADMIN_ROLE = ROLES.ADMIN;

const isAdmin = (req, res, next) => {
    if (req.user?.type_users_id !== ADMIN_ROLE) {
        return res.status(403).json({ message: 'No tenés permisos para esta acción' });
    }
    next();
};

// Organizadores y administradores (crear/editar eventos, ver asistentes, reportes)
const isOrganizer = (req, res, next) => {
    if (![ROLES.ADMIN, ROLES.ORGANIZADOR].includes(req.user?.type_users_id)) {
        return res.status(403).json({ message: 'Solo organizadores o administradores pueden hacer esta acción' });
    }
    next();
};

// Helper: el admin puede gestionar cualquier evento, el organizador solo los suyos
const canManageVenue = (user, venue) =>
    user.type_users_id === ROLES.ADMIN || venue.user_id === user.id;

module.exports = { auth, isAdmin, isOrganizer, canManageVenue, ROLES };
