const { SecurityMeasures } = require('../models');

const createMeasure = async (req, res) => {
    try {
        const newMeasure = await SecurityMeasures.create(req.body);
        return res.status(201).json({ status: "success", message: "Medidas de seguridad registradas", measures_id: newMeasure.id });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

const getMeasure = async (req, res) => {
    try {
        const { venue_id } = req.query;
        const measure = await SecurityMeasures.findOne({ where: { venue_id } });
        if(!measure) return res.status(404).json({status: "error", message: "No hay medidas para este evento"});
        return res.status(200).json(measure);
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

const updateMeasure = async (req, res) => {
    try {
        const { venue_id, ...dataToUpdate } = req.body;
        const measure = await SecurityMeasures.findOne({ where: { venue_id } });
        if(!measure) return res.status(404).json({status: "error", message: "No hay medidas para este evento"});
        
        await measure.update(dataToUpdate);
        return res.status(200).json({ status: "success", message: "Medidas de seguridad actualizadas correctamente" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { createMeasure, getMeasure, updateMeasure };