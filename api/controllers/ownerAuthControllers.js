// ===================== Importaciones =====================
const OwnerAuthorization = require('../models/Owner_Authorization');

// ===================== Controladores =====================

// POST /api/autorizacion-dueno
const createAuthorization = async (req, res) => {
    const { venue_id, owner_name, owner_dni, phone, residential_address, document } = req.body;

    try {
        if (!venue_id || !owner_name || !owner_dni || !phone || !residential_address || !document)
            return res.status(400).json({ message: 'Faltan datos obligatorios' });

        if (isNaN(owner_dni)) return res.status(400).json({ message: 'El DNI tiene que ser un número' });
        if (isNaN(phone)) return res.status(400).json({ message: 'El teléfono tiene que ser un número' });

        const authorization = await OwnerAuthorization.create({
            venue_id, owner_name, owner_dni, phone, residential_address, document
        });

        return res.status(201).json(authorization);
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError')
            return res.status(400).json({ message: 'La sede indicada no existe' });
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/autorizacion-dueno  (opcional: ?venue_id=1)
const getAuthorizations = async (req, res) => {
    const { venue_id } = req.query;

    try {
        const where = {};
        if (venue_id) where.venue_id = venue_id;

        const authorizations = await OwnerAuthorization.findAll({ where });
        return res.json(authorizations);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PUT/PATCH /api/autorizacion-dueno/:id
const updateAuthorization = async (req, res) => {
    const { owner_name, owner_dni, phone, residential_address, document } = req.body;
    const changes = {};

    try {
        if (owner_name) changes.owner_name = owner_name;
        if (owner_dni) {
            if (isNaN(owner_dni)) return res.status(400).json({ message: 'El DNI tiene que ser un número' });
            changes.owner_dni = owner_dni;
        }
        if (phone) {
            if (isNaN(phone)) return res.status(400).json({ message: 'El teléfono tiene que ser un número' });
            changes.phone = phone;
        }
        if (residential_address) changes.residential_address = residential_address;
        if (document) changes.document = document;

        if (Object.keys(changes).length === 0)
            return res.status(400).json({ message: 'Ingrese al menos un valor a modificar' });

        const authorization = await OwnerAuthorization.findByPk(req.params.id);
        if (!authorization) return res.status(404).json({ message: 'Autorización no encontrada' });

        await authorization.update(changes);
        return res.json({ message: 'Se actualizó la autorización correctamente' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { createAuthorization, getAuthorizations, updateAuthorization };