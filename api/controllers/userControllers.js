const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Gender, TypeUser } = require('../models');
const { ROLES } = require('../middlewares/authMiddlewares');
const { JWT_SECRET } = require('../config/jwt');
const { sendMail } = require('../utils/mailer');
const { createCode, checkCode } = require('../utils/verificationCodes');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

// ===================== LOGIN =====================
// Se puede loguear con email + contraseña o con teléfono + contraseña
const findUserByCredentials = async ({ email, phone }) => {
    if (email) return User.findOne({ where: { email: String(email).trim().toLowerCase() } });
    return User.findOne({ where: { phone: String(phone).trim() } });
};

const login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        if ((!email && !phone) || !password) {
            return res.status(400).json({ message: 'Faltan email/teléfono o contraseña' });
        }

        const user = await findUserByCredentials({ email, phone });

        const ok = user && (await bcrypt.compare(String(password), user.password));
        if (!ok) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        return res.json({ status: 'success', token: signToken(user), user: publicUser(user) });
    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ===================== ADMIN LOGIN (2 pasos) =====================
// Paso 1: POST /api/auth/admin_login   body: { user_name | email, password }
//   Si los datos son correctos manda un código de 6 dígitos al mail del admin
//   y devuelve un "pre_token" temporal (10 min) que NO sirve como sesión.
const adminLogin = async (req, res) => {
    try {
        const { email, user_name, username, password } = req.body;
        const identifier = String(user_name || username || email || '').trim();
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Faltan usuario o contraseña' });
        }

        // Se puede ingresar con el nombre de usuario o con el email
        const user = await User.findOne({
            where: { [Op.or]: [{ user_name: identifier }, { email: identifier.toLowerCase() }] },
        });

        const ok = user && (await bcrypt.compare(String(password), user.password));
        if (!ok) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        if (user.type_users_id !== ROLES.ADMIN) {
            return res.status(403).json({ message: 'El usuario no es administrador' });
        }

        const code = createCode('admin', user.id);
        await sendMail({
            to: user.email,
            subject: 'EventoXpress - Código de acceso de administrador',
            text: `Tu código de acceso es: ${code}\nVence en 10 minutos.`,
        });

        const preToken = jwt.sign({ id: user.id, purpose: 'admin_2fa' }, JWT_SECRET, { expiresIn: '10m' });

        return res.json({
            status: 'pending',
            message: 'Te enviamos un código a tu correo',
            pre_token: preToken,
        });
    } catch (err) {
        console.error('Error en adminLogin:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Paso 2: POST /api/auth/admin_verify   body: { pre_token, code }
const adminVerify = async (req, res) => {
    try {
        const { pre_token, code } = req.body;
        if (!pre_token || !code) return res.status(400).json({ message: 'Falta el código' });

        let decoded;
        try {
            decoded = jwt.verify(pre_token, JWT_SECRET);
        } catch {
            return res.status(401).json({ message: 'La sesión expiró, volvé a ingresar usuario y clave' });
        }
        if (decoded.purpose !== 'admin_2fa') return res.status(401).json({ message: 'Token inválido' });

        const error = checkCode('admin', decoded.id, code);
        if (error) return res.status(401).json({ message: error });

        const user = await User.findByPk(decoded.id);
        if (!user || user.type_users_id !== ROLES.ADMIN)
            return res.status(403).json({ message: 'El usuario no es administrador' });

        return res.json({
            status: 'success',
            token: signToken(user),
            admin: { ...publicUser(user), rol: 'administrador' },
        });
    } catch (err) {
        console.error('Error en adminVerify:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ===================== LOGIN ORGANIZADOR (código por mail) =====================
// Paso 1: POST /api/auth/organizer/request_code   body: { email }
const organizerRequestCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Falta el correo' });

        const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
        if (!user || ![ROLES.ADMIN, ROLES.ORGANIZADOR].includes(user.type_users_id)) {
            return res.status(404).json({ message: 'El mail ingresado no es parte de organizadores.' });
        }

        const code = createCode('organizer', user.id);
        await sendMail({
            to: user.email,
            subject: 'EventoXpress - Código de ingreso',
            text: `Tu código de ingreso es: ${code}\nVence en 10 minutos.`,
        });

        return res.json({ status: 'success', message: 'Te enviamos un código de 6 dígitos a tu correo' });
    } catch (err) {
        console.error('Error en organizerRequestCode:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Paso 2: POST /api/auth/organizer/verify_code   body: { email, code }
const organizerVerifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) return res.status(400).json({ message: 'Faltan el correo o el código' });

        const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
        if (!user || ![ROLES.ADMIN, ROLES.ORGANIZADOR].includes(user.type_users_id)) {
            return res.status(404).json({ message: 'El mail ingresado no es parte de organizadores.' });
        }

        const error = checkCode('organizer', user.id, code);
        if (error) return res.status(401).json({ message: error });

        return res.json({ status: 'success', token: signToken(user), user: publicUser(user) });
    } catch (err) {
        console.error('Error en organizerVerifyCode:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ===================== RECUPERAR CONTRASEÑA =====================
// POST /api/auth/recover_password   body: { email } o { phone }
// Manda al mail del usuario un link a /reset-password?token=... (válido 15 min).
// Siempre responde lo mismo para no revelar qué cuentas existen.
const recoverPassword = async (req, res) => {
    const genericResponse = {
        status: 'success',
        message: 'Si los datos corresponden a una cuenta, te enviamos las instrucciones a tu correo',
    };

    try {
        const { email, phone } = req.body;
        if (!email && !phone) return res.status(400).json({ message: 'Ingresá tu correo o teléfono' });

        const user = await findUserByCredentials({ email, phone });
        if (!user) return res.json(genericResponse);

        // Se incluye un pedazo del hash actual: cuando cambia la contraseña el link deja de servir
        const token = jwt.sign(
            { id: user.id, purpose: 'reset', pwd: user.password.slice(-10) },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
        const link = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

        await sendMail({
            to: user.email,
            subject: 'EventoXpress - Recuperar contraseña',
            text: `Para crear una nueva contraseña entrá a este link (vence en 15 minutos):\n${link}`,
        });

        return res.json(genericResponse);
    } catch (err) {
        console.error('Error en recoverPassword:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// POST /api/auth/reset_password   body: { token, password }
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token) return res.status(400).json({ message: 'El link no es válido, pedí uno nuevo' });
        if (!password || String(password).length < 8)
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return res.status(401).json({ message: 'El link expiró, pedí uno nuevo' });
        }
        if (decoded.purpose !== 'reset') return res.status(401).json({ message: 'El link no es válido' });

        const user = await User.findByPk(decoded.id);
        if (!user || user.password.slice(-10) !== decoded.pwd)
            return res.status(401).json({ message: 'El link ya fue usado, pedí uno nuevo' });

        user.password = await bcrypt.hash(String(password), 10);
        await user.save();

        return res.json({ status: 'success', message: 'Contraseña cambiada correctamente' });
    } catch (err) {
        console.error('Error en resetPassword:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ===================== AUTH VERIFY =====================
// GET /api/auth/auth_verify  (el usuario sale del token)
const PERMISOS = {
    [ROLES.ADMIN]: ['gestionar_usuarios', 'gestionar_eventos', 'ver_estadisticas', 'enviar_notificaciones'],
    [ROLES.ORGANIZADOR]: ['gestionar_eventos_propios', 'ver_asistentes', 'ver_estadisticas', 'enviar_notificaciones'],
    [ROLES.CONSUMIDOR]: ['ver_eventos', 'registrar_asistencia', 'gestionar_favoritos'],
};

const authVerify = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'full_name', 'email', 'type_users_id'],
            include: [{ model: TypeUser, as: 'type_user', attributes: ['name'] }],
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const data = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            type_users_id: user.type_users_id,
            rol: user.type_user?.name,
            permisos: PERMISOS[user.type_users_id] || [],
        };

        // Misma forma que el contrato: si es admin se devuelve como "admin"
        if (user.type_users_id === ROLES.ADMIN) return res.json({ status: 'success', admin: data });
        return res.json({ status: 'success', user: data });
    } catch (err) {
        console.error('Error en authVerify:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función auxiliar: valida los campos y actualiza al usuario con ese id
// options.admin = true -> el admin además puede cambiar DNI y género (y editar usuarios desactivados)
const updateById = async (id, req, res, options = {}) => {
    const { full_name, user_name, email, phone, birthdate, dni, gender_id } = req.body;
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
        if (options.admin && dni) {
            if (!/^\d{7,8}$/.test(String(dni))) return res.status(400).json({ message: 'El DNI tiene que tener 7 u 8 números' });
            changes.dni = dni;
        }
        if (options.admin && gender_id) {
            if (![1, 2, 3, 4].includes(Number(gender_id))) return res.status(400).json({ message: 'Género inválido' });
            changes.gender_id = Number(gender_id);
        }

        if (Object.keys(changes).length === 0)
            return res.status(400).json({ message: 'Ingrese al menos un valor a modificar' });

        const [updated] = await User.update(changes, { where: { id }, paranoid: !options.admin });
        if (updated === 0) return res.status(404).json({ message: 'No se modificó ningún usuario' });

        return res.json({ message: 'Se actualizó el usuario correctamente' });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ message: 'Ese email, usuario o DNI ya está en uso' });
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

// GET /api/auth/users_getById/:id (también encuentra a los desactivados)
const usersGetById = async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ message: 'El id tiene que ser un número' });

        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Gender, as: 'gender', attributes: ['id', 'gender_name'] },
                { model: TypeUser, as: 'type_user', attributes: ['id', 'name'] },
            ],
            paranoid: false,
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.json({ ...user.toJSON(), estado: user.deleted_at ? 'inactivo' : 'activo' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/auth/users_status/:id   body: { active: true | false } o { estado: "activo" | "inactivo" }
const usersStatus = async (req, res) => {
    let { active, estado } = req.body;
    if (active === undefined && (estado === 'activo' || estado === 'inactivo')) active = estado === 'activo';

    try {
        if (typeof active !== 'boolean')
            return res.status(400).json({ message: 'active tiene que ser true o false' });

        if (Number(req.params.id) === req.user.id)
            return res.status(400).json({ message: 'No podés cambiar tu propio estado' });

        const user = await User.findByPk(req.params.id, { paranoid: false });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (active) await user.restore();
        else await user.destroy();

        return res.json({
            status: 'success',
            message: active ? 'Usuario activado' : 'Usuario desactivado',
            user: { id: user.id, estado: active ? 'activo' : 'inactivo' },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PATCH /api/users_mody/:id
const usersMody = (req, res) => updateById(req.params.id, req, res, { admin: true });

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

module.exports = {
    register, login, adminLogin, adminVerify, organizerRequestCode, organizerVerifyCode,
    recoverPassword, resetPassword, authVerify, info, modify,
    usersGet, usersGetById, usersMody, usersRole, usersStatus
};