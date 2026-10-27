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

module.exports = { register, login };