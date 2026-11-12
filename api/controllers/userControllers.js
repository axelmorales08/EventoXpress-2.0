const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Gender } = require('../models');
const { JWT_SECRET } = require('../config/jwt');

const signToken = (user) =>
    jwt.sign(
        { id: user.id, type_users_id: user.type_users_id },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

const publicUser = (user) => ({
    id: user.id,
    full_name: user.full_name,
    user_name: user.user_name,
    email: user.email,
    type_users_id: user.type_users_id,
});

// ===================== REGISTER =====================
const register = async (req, res) => {
    try {
        const {
            full_name, user_name, dni, email, phone, password,
            gender_id, birthdate, type_users_id,
        } = req.body;

        // Campos obligatorios (según la tabla users)
        if (!full_name || !user_name || !dni || !email || !phone || !password || !gender_id) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        const cleanEmail = String(email).trim().toLowerCase();
        const cleanUserName = String(user_name).trim();
        const cleanDni = String(dni).trim();

        if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
            return res.status(400).json({ message: 'Email inválido' });
        }
        if (!/^\d{7,8}$/.test(cleanDni)) {
            return res.status(400).json({ message: 'DNI inválido (7 u 8 dígitos)' });
        }
        if (String(password).length < 8) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
        }
        if (birthdate && isNaN(new Date(birthdate).getTime())) {
            return res.status(400).json({ message: 'Fecha de nacimiento inválida' });
        }

        const gender = await Gender.findByPk(gender_id);
        if (!gender) {
            return res.status(400).json({ message: 'Género inválido' });
        }

        const role = Number(type_users_id) === 2 ? 2 : 3;

        const exists = await User.findOne({
            where: { [Op.or]: [{ email: cleanEmail }, { user_name: cleanUserName }, { dni: cleanDni }] },
            paranoid: false,
        });
        if (exists) {
            return res.status(409).json({ message: 'Ya existe un usuario con ese email, usuario o DNI' });
        }

        const hash = await bcrypt.hash(String(password), 10);

        const user = await User.create({
            type_users_id: role,
            gender_id: gender.id,
            full_name: String(full_name).trim(),
            user_name: cleanUserName,
            dni: cleanDni,
            email: cleanEmail,
            phone: String(phone).trim(),
            birthdate: birthdate || null,
            password: hash,
        });

        return res.status(201).json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ya existe un usuario con esos datos' });
        }
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Datos inválidos' });
        }
        console.error('Error en register:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Faltan email o contraseña' });
        }

        const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });

        const ok = user && (await bcrypt.compare(String(password), user.password));
        if (!ok) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        return res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función auxiliar: valida los campos y actualiza al usuario con ese id
const updateById = async (id, req, res) => {
    const { full_name, user_name, email, phone, birthdate } = req.body;
    const changes = {};

    try {
        if (full_name) changes.full_name = full_name;
        if (user_name) changes.user_name = user_name;
        if (email) {
            if (!email.includes('@')) return res.status(400).json({ message: 'El email no es válido' });
            changes.email = email;
        }
        if (phone) {
            if (isNaN(phone)) return res.status(400).json({ message: 'El teléfono tiene que ser un número' });
            changes.phone = phone;
        }
        if (birthdate) {
            if (isNaN(Date.parse(birthdate))) return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });
            changes.birthdate = birthdate;
        }

        if (Object.keys(changes).length === 0)
            return res.status(400).json({ message: 'Ingrese al menos un valor a modificar' });

        const [updated] = await User.update(changes, { where: { id } });
        if (updated === 0) return res.status(404).json({ message: 'No se modificó ningún usuario' });

        return res.json({ message: 'Se actualizó el usuario correctamente' });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ message: 'Ese email o usuario ya está en uso' });
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/info
const info = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/modify
const modify = (req, res) => updateById(req.user.id, req, res);

// GET /api/auth/users_get (incluye los desactivados, se reconocen por deleted_at)
const usersGet = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            paranoid: false
        });
        return res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/auth/users_status/:id   body: { active: true | false }
const usersStatus = async (req, res) => {
    const { active } = req.body;

    try {
        if (typeof active !== 'boolean')
            return res.status(400).json({ message: 'active tiene que ser true o false' });

        if (Number(req.params.id) === req.user.id)
            return res.status(400).json({ message: 'No podés cambiar tu propio estado' });

        const user = await User.findByPk(req.params.id, { paranoid: false });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (active) await user.restore();
        else await user.destroy();

        return res.json({ message: active ? 'Usuario activado' : 'Usuario desactivado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/users_mody/:id
const usersMody = (req, res) => updateById(req.params.id, req, res);

// PATCH /api/users_role/:id   body: { type_users_id }
const usersRole = async (req, res) => {
    const { type_users_id } = req.body;

    try {
        if (![1, 2, 3].includes(Number(type_users_id)))
            return res.status(400).json({ message: 'Rol inválido' });

        const [updated] = await User.update({ type_users_id }, { where: { id: req.params.id } });
        if (updated === 0) return res.status(404).json({ message: 'No se modificó ningún usuario' });

        return res.json({ message: 'Se actualizó el rol correctamente' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { register, login, info, modify, usersGet, usersMody, usersRole, usersStatus };