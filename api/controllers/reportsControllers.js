// ===================== Importaciones =====================
const {
    Venue, Category, Ticket, VenueAssistance, UserFavorites,
} = require('../models');
const { ROLES } = require('../middlewares/authMiddlewares');

// ===================== Helpers =====================

// El admin ve los reportes de todos los eventos, el organizador solo de los suyos
const ownerFilter = (user) => (user.type_users_id === ROLES.ADMIN ? {} : { user_id: user.id });

const today = () => new Date(new Date().toDateString());

const eventStatus = (event) => {
    const now = today();
    if (new Date(event.ending) < now) return 'finalizado';
    if (new Date(event.beginning) > now) return 'proximo';
    return 'en_curso';
};

// ===================== Controladores =====================

// GET /api/reports/events
// Resumen general de eventos: totales, por estado, por categoría y detalle de cada uno.
const eventsReport = async (req, res) => {
    try {
        const events = await Venue.findAll({
            where: ownerFilter(req.user),
            include: [
                { model: Category, as: 'category', attributes: ['id', 'name'] },
                { model: VenueAssistance, as: 'assistance', attributes: ['id'] },
                { model: UserFavorites, as: 'favorites', attributes: ['id'] },
                { model: Ticket, as: 'tickets', attributes: ['price', 'available_quantity'] },
            ],
            order: [['beginning', 'ASC']],
        });

        const resumen = {
            total_eventos: events.length,
            publicados: 0,
            en_proceso: 0,
            proximos: 0,
            en_curso: 0,
            finalizados: 0,
        };
        const porCategoria = {};

        const detalle = events.map((event) => {
            if (event.state === 'publico') resumen.publicados++;
            else resumen.en_proceso++;

            const status = eventStatus(event);
            if (status === 'proximo') resumen.proximos++;
            else if (status === 'en_curso') resumen.en_curso++;
            else resumen.finalizados++;

            const categoryName = event.category?.name || 'Sin categoría';
            porCategoria[categoryName] = (porCategoria[categoryName] || 0) + 1;

            const prices = event.tickets.map((t) => Number(t.price));

            return {
                id: event.id,
                nombre: event.name,
                categoria: categoryName,
                estado: event.state,
                situacion: status,
                fecha_inicio: event.beginning,
                fecha_finalizacion: event.ending,
                asistentes: event.assistance.length,
                favoritos: event.favorites.length,
                entradas_disponibles: event.tickets.reduce((acc, t) => acc + t.available_quantity, 0),
                precio_minimo: prices.length ? Math.min(...prices) : null,
                precio_maximo: prices.length ? Math.max(...prices) : null,
            };
        });

        return res.json({
            status: 'success',
            resumen,
            por_categoria: Object.entries(porCategoria).map(([categoria, cantidad]) => ({ categoria, cantidad })),
            eventos: detalle,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /api/reports/attendance   (opcional: ?venue_id=1)
// Métricas de asistencia: total, promedio por evento y ranking de eventos más concurridos.
const attendanceReport = async (req, res) => {
    const { venue_id } = req.query;

    try {
        const where = ownerFilter(req.user);
        if (venue_id) {
            if (isNaN(venue_id)) return res.status(400).json({ message: 'venue_id tiene que ser un número' });
            where.id = venue_id;
        }

        const events = await Venue.findAll({
            where,
            attributes: ['id', 'name', 'beginning', 'ending'],
            include: [
                { model: VenueAssistance, as: 'assistance', attributes: ['id'] },
                { model: Ticket, as: 'tickets', attributes: ['available_quantity'] },
            ],
        });

        if (venue_id && events.length === 0)
            return res.status(404).json({ message: 'Evento no encontrado o no es tuyo' });

        const ranking = events
            .map((event) => {
                const asistentes = event.assistance.length;
                const capacidad = event.tickets.reduce((acc, t) => acc + t.available_quantity, 0);
                return {
                    id: event.id,
                    nombre: event.name,
                    fecha_inicio: event.beginning,
                    asistentes,
                    entradas_disponibles: capacidad,
                    // % de asistentes sobre las entradas cargadas (null si no tiene entradas)
                    ocupacion: capacidad > 0 ? Number(((asistentes / capacidad) * 100).toFixed(2)) : null,
                };
            })
            .sort((a, b) => b.asistentes - a.asistentes);

        const totalAsistencias = ranking.reduce((acc, e) => acc + e.asistentes, 0);

        return res.json({
            status: 'success',
            total_eventos: ranking.length,
            total_asistencias: totalAsistencias,
            promedio_por_evento: ranking.length ? Number((totalAsistencias / ranking.length).toFixed(2)) : 0,
            evento_mas_concurrido: ranking[0] || null,
            eventos: ranking,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = { eventsReport, attendanceReport };
