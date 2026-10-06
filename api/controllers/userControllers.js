// ===================== Importaciones =====================
// const { User, Role, School } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config/jwt');

/* EJEMPLO: ELIMINAR O MODIFICAR DESPUES

// ===================== Controladores =====================

// Login
const login = async (req, res) => {
    const { cuil, tuition, email, password } = req.body;

    try {
        if ((cuil || tuition) && (email || password))
            return res.status(400).json({ message: 'Use solo un método de login a la vez' });


        if (cuil !== undefined && tuition !== undefined) {
            if (!Number.isInteger(cuil) || cuil <= 0 || !Number.isInteger(tuition) || tuition <= 0) {
                return res.status(400).json({ message: 'CUIL y matrícula deben ser números enteros positivos' });
            }

            const user = await User.findOne({
                where: { cuil },
                include: [{ model: Role, as: 'role' }]
            });

            if (!user)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            if (user.tuition !== tuition)
                return res.status(401).json({ message: 'Matrícula incorrecta' });

            const token = jwt.sign({ id: user.id, role: user.role?.name }, JWT_SECRET, { expiresIn: '1h' });

            return res.json({ token, role: user.role?.name });
        }

        if (email && password) {

            const user = await User.findOne({
                where: { email },
                include: [{ model: Role, as: 'role' }]
            });

            if (!user)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            if (!(await bcrypt.compare(password, user.password)))
                return res.status(401).json({ message: 'Contraseña incorrecta' });

            const token = jwt.sign({ id: user.id, role: user.role?.name }, JWT_SECRET);

            return res.json({ token, role: user.role?.name });
        }

        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
};

*/