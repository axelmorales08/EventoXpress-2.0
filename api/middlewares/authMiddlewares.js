// ===================== Importaciones =====================
// const { User, Role, Permission, Entity } = require('../models');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

// ===================== Middlewares =====================

/* EJEMPLO: ELIMINAR O MODIFICAR DESPUES

// Verificación de tokens
async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization
        if (!token)
            return res.status(400).json({ message: 'No se envió token' });

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.log("se fallo el acceso por token");
                return res.status(401).json({ message: 'Token inválido o expirado' });

            }

            const user = await User.findByPk(decoded.id, {
                include: {
                    model: Role,
                    as: 'role',
                    include: {
                        model: Permission,
                        as: 'permissions'
                    }
                }
            });
            if (!user)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                school_id: user.school_id
            }

            next()
        });
    } catch (err) {
        console.error("Error en middleware token:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
*/