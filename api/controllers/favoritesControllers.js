const { UserFavorites } = require('../models');

const addFavorite = async (req, res) => {
    try {
        const { user_id, venue_id } = req.body;
        const fav = await UserFavorites.create({ user_id, venue_id });
        return res.status(201).json({ status: "success", message: "agregado a favoritos", fav });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { user_id, venue_id } = req.body; // Usamos body para el delete
        const deleted = await UserFavorites.destroy({ where: { user_id, venue_id } });
        if (deleted) return res.status(200).json({ status: "success", message: "eliminada de favoritos" });
        return res.status(404).json({ status: "error", message: "Favorito no encontrado" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { addFavorite, removeFavorite };