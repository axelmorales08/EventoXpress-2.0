const { UserFavorites, Venue } = require('../models');

// El usuario sale del token (req.user), así nadie puede tocar los favoritos de otro

// POST /api/favorite   body: { venue_id }
const addFavorite = async (req, res) => {
    try {
        const { venue_id } = req.body;
        const user_id = req.user.id;
        if (!venue_id) return res.status(400).json({ status: "error", message: "Falta el id del evento (venue_id)" });

        const venue = await Venue.findByPk(venue_id);
        if (!venue) return res.status(404).json({ status: "error", message: "El evento no existe" });

        const [fav, created] = await UserFavorites.findOrCreate({ where: { user_id, venue_id } });
        if (!created) return res.status(409).json({ status: "error", message: "El evento ya está en favoritos" });

        return res.status(201).json({ status: "success", message: "agregado a favoritos", fav });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// DELETE /api/desfavorite   body: { venue_id }
const removeFavorite = async (req, res) => {
    try {
        const { venue_id } = req.body; // Usamos body para el delete
        const deleted = await UserFavorites.destroy({ where: { user_id: req.user.id, venue_id } });
        if (deleted) return res.status(200).json({ status: "success", message: "eliminada de favoritos" });
        return res.status(404).json({ status: "error", message: "Favorito no encontrado" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// GET /api/favorites   -> eventos favoritos del usuario logueado
const getFavorites = async (req, res) => {
    try {
        const favorites = await UserFavorites.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Venue, as: 'venue', required: true }],
        });
        return res.status(200).json(favorites.map((f) => f.venue));
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
