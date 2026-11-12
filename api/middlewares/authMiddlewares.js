const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../config/jwt');

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

const ADMIN_ROLE = 1; // confirmame que el admin es 1

const isAdmin = (req, res, next) => {
    if (req.user?.type_users_id !== ADMIN_ROLE) {
        return res.status(403).json({ message: 'No tenés permisos para esta acción' });
    }
    next();
};

module.exports = { auth, isAdmin };