// ===================== Importaciones =====================
const { Op } = require('sequelize');
const {
    db, Venue, Category, TypeVenue, User, Ticket,
    VenueAssistance, UserFavorites, Notification,
} = require('../models');
const { ROLES, canManageVenue } = require('../middlewares/authMiddlewares');

// ===================== Helpers =====================

// Relaciones que se devuelven junto con cada evento
const venueIncludes = () => [
    { model: Category, as: 'category', attributes: ['id', 'name'] },
    { model: TypeVenue, as: 'type_venue', attributes: ['id', 'name'] },
    { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
    { model: Ticket, as: 'tickets', attributes: ['id', 'name', 'price', 'available_quantity'] },
];

// Campos que se pueden cargar o modificar desde el body
const EDITABLE_FIELDS = [
    'type_venue_id', 'category_id', 'province', 'locality', 'address', 'description',
    'beginning', 'ending', 'image', 'name', 'suitable_for_all_audiences', 'state',
];

const isValidDate = (value) => !isNaN(Date.parse(value));

// Valida los datos de un evento. Devuelve un string con el error o null si está todo bien.
// "current" es el evento actual cuando se está modificando (para comparar fechas).
const validateVenueData = async (data, current = null) => {
    if (data.name !== undefined && String(data.name).trim().length > 64)
        return 'El nombre no puede superar los 64 caracteres';

    if (data.beginning !== undefined && !isValidDate(data.beginning))
        return 'La fecha de inicio no es válida';
    if (data.ending !== undefined && !isValidDate(data.ending))
        return 'La fecha de finalización no es válida';

    const beginning = data.beginning ?? current?.beginning;
    const ending = data.ending ?? current?.ending;
    if (beginning && ending && new Date(ending) < new Date(beginning))
        return 'La fecha de finalización no puede ser anterior a la de inicio';

    if (data.state !== undefined && !['publico', 'en proceso'].includes(data.state))
        return 'El estado tiene que ser "publico" o "en proceso"';

    if (data.suitable_for_all_audiences !== undefined && typeof data.suitable_for_all_audiences !== 'boolean')
        return 'suitable_for_all_audiences tiene que ser true o false';

    if (data.category_id !== undefined && !(await Category.findByPk(data.category_id)))
        return 'La categoría indicada no existe';
    if (data.type_venue_id !== undefined && !(await TypeVenue.findByPk(data.type_venue_id)))
        return 'El tipo de evento indicado no existe';

    return null;
};

// Se queda solo con los campos permitidos que vinieron en el body
const pickFields = (body) => {
    const data = {};
    EDITABLE_FIELDS.forEach((field) => {
        if (body[field] !== undefined && body[field] !== '') data[field] = body[field];
    });
    return data;
};

// ===================== Controladores =====================

// GET /api/ev_info            -> listado completo (opcional: ?id=1 o ?state=publico)
const getEvents = async (req, res) => {
    const { id, state } = req.query;

    try {
        if (id) {
            if (isNaN(id)) return res.status(400).json({ message: 'El id tiene que ser un número' });
            const event = await Venue.findByPk(id, { include: venueIncludes() });
            if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
            return res.json(event);
        }

        const where = {};
        if (state) where.state = state;

        const events = await Venue.findAll({
            where,
            include: venueIncludes(),
            order: [['beginning', 'ASC']],
        });
        return res.json(events);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/events_getById/:id
const getEventById = async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ message: 'El id tiene que ser un número' });

        const event = await Venue.findByPk(req.params.id, { include: venueIncludes() });
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

        const asistentes = await VenueAssistance.count({ where: { venue_id: event.id } });
        return res.json({ ...event.toJSON(), asistentes });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// POST /api/ev_post   (organizador o admin)
const createEvent = async (req, res) => {
    const data = pickFields(req.body);
    const required = ['type_venue_id', 'category_id', 'province', 'locality', 'address', 'description', 'beginning', 'ending', 'name'];

    try {
        const missing = required.filter((field) => data[field] === undefined);
        if (missing.length > 0)
            return res.status(400).json({ message: `Faltan datos obligatorios: ${missing.join(', ')}` });

        const error = await validateVenueData(data);
        if (error) return res.status(400).json({ message: error });

        // El dueño del evento es el usuario logueado.
        // Un admin puede crearlo a nombre de un organizador mandando user_id.
        let ownerId = req.user.id;
        if (req.user.type_users_id === ROLES.ADMIN && req.body.user_id) {
            const owner = await User.findByPk(req.body.user_id);
            if (!owner) return res.status(400).json({ message: 'El organizador indicado no existe' });
            ownerId = owner.id;
        }

        if (data.state === 'publico') data.published = new Date();

        const event = await Venue.create({ ...data, user_id: ownerId });

        return res.status(201).json({
            mensaje: 'Evento registrado correctamente',
            evento: {
                id: event.id,
                name: event.name,
                type_venue_id: event.type_venue_id,
                category_id: event.category_id,
            },
        });
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError')
            return res.status(400).json({ message: 'Alguno de los datos relacionados no existe' });
        if (err.name === 'SequelizeValidationError')
            return res.status(400).json({ message: 'Datos inválidos' });
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// PUT /api/ev_mody/:id   (solo el organizador dueño o un admin)
const updateEvent = async (req, res) => {
    const changes = pickFields(req.body);

    try {
        if (isNaN(req.params.id)) return res.status(400).json({ message: 'El id tiene que ser un número' });
        if (Object.keys(changes).length === 0)
            return res.status(400).json({ message: 'Ingrese al menos un valor a modificar' });

        const event = await Venue.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
        if (!canManageVenue(req.user, event))
            return res.status(403).json({ message: 'No podés modificar un evento que no es tuyo' });

        const error = await validateVenueData(changes, event);
        if (error) return res.status(400).json({ message: error });

        // Al publicarlo se guarda la fecha de publicación
        if (changes.state === 'publico' && event.state !== 'publico') changes.published = new Date();
        if (changes.state === 'en proceso') changes.published = null;

        await event.update(changes);

        const updated = await Venue.findByPk(event.id, { include: venueIncludes() });
        return res.json({ mensaje: 'Evento actualizado correctamente', evento: updated });
    } catch (err) {
        if (err.name === 'SequelizeForeignKeyConstraintError')
            return res.status(400).json({ message: 'Alguno de los datos relacionados no existe' });
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// DELETE /api/ev_del/:id   (solo el organizador dueño o un admin)
// Borrado lógico (deleted_at). Antes se avisa a los asistentes y se limpian
// las asistencias y favoritos asociados, todo dentro de una transacción.
const deleteEvent = async (req, res) => {
    const transaction = await db.transaction();

    try {
        if (isNaN(req.params.id)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'El id tiene que ser un número' });
        }

        const event = await Venue.findByPk(req.params.id, { transaction });
        if (!event) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        if (!canManageVenue(req.user, event)) {
            await transaction.rollback();
            return res.status(403).json({ message: 'No podés eliminar un evento que no es tuyo' });
        }

        const assistance = await VenueAssistance.findAll({ where: { venue_id: event.id }, transaction });

        if (assistance.length > 0) {
            await Notification.bulkCreate(
                assistance.map((a) => ({
                    user_id: a.user_id,
                    venue_id: event.id,
                    title: 'Evento cancelado',
                    message: `El evento "${event.name}" al que ibas a asistir fue cancelado.`,
                })),
                { transaction }
            );
        }

        await VenueAssistance.destroy({ where: { venue_id: event.id }, transaction });
        await UserFavorites.destroy({ where: { venue_id: event.id }, transaction });
        await event.destroy({ transaction });

        await transaction.commit();
        return res.json({ mensaje: 'Evento eliminado correctamente', id: event.id });
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/fil_ev
// Filtros (todos opcionales y combinables):
//   fecha=2026-09-15                 -> eventos que estén en curso ese día
//   fecha_desde=...&fecha_hasta=...  -> eventos dentro de un rango
//   precio_min=1000&precio_max=5000  -> según el precio de sus entradas
//   provincia=Buenos Aires&localidad=CABA  (búsqueda parcial, sin importar mayúsculas)
//   ubicacion=corrientes             -> busca en provincia, localidad o dirección
//   categoria=1, tipo=1, state=publico
const filterEvents = async (req, res) => {
    const {
        fecha, fecha_desde, fecha_hasta, precio_min, precio_max,
        provincia, localidad, ubicacion, categoria, tipo, state,
    } = req.query;

    try {
        const where = {};
        const and = [];

        // ----- Fecha -----
        for (const [name, value] of Object.entries({ fecha, fecha_desde, fecha_hasta })) {
            if (value && !isValidDate(value))
                return res.status(400).json({ message: `El filtro ${name} no es una fecha válida` });
        }
        if (fecha) {
            and.push({ beginning: { [Op.lte]: fecha } }, { ending: { [Op.gte]: fecha } });
        }
        if (fecha_desde) and.push({ ending: { [Op.gte]: fecha_desde } });
        if (fecha_hasta) and.push({ beginning: { [Op.lte]: fecha_hasta } });

        // ----- Ubicación -----
        if (provincia) where.province = { [Op.iLike]: `%${provincia}%` };
        if (localidad) where.locality = { [Op.iLike]: `%${localidad}%` };
        if (ubicacion) {
            and.push({
                [Op.or]: [
                    { province: { [Op.iLike]: `%${ubicacion}%` } },
                    { locality: { [Op.iLike]: `%${ubicacion}%` } },
                    { address: { [Op.iLike]: `%${ubicacion}%` } },
                ],
            });
        }

        // ----- Otros -----
        if (categoria) where.category_id = categoria;
        if (tipo) where.type_venue_id = tipo;
        if (state) where.state = state;

        if (and.length > 0) where[Op.and] = and;

        // ----- Precio (sale de la tabla tickets) -----
        if (precio_min && isNaN(precio_min)) return res.status(400).json({ message: 'precio_min tiene que ser un número' });
        if (precio_max && isNaN(precio_max)) return res.status(400).json({ message: 'precio_max tiene que ser un número' });

        const includes = venueIncludes();
        if (precio_min || precio_max) {
            const priceWhere = {};
            if (precio_min) priceWhere[Op.gte] = Number(precio_min);
            if (precio_max) priceWhere[Op.lte] = Number(precio_max);

            // required: true -> solo trae eventos que tengan alguna entrada en ese rango
            const ticketInclude = includes.find((i) => i.as === 'tickets');
            ticketInclude.where = { price: priceWhere };
            ticketInclude.required = true;
        }

        const events = await Venue.findAll({
            where,
            include: includes,
            order: [['beginning', 'ASC']],
        });

        return res.json(events);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, filterEvents };
