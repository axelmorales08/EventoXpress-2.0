const { Ticket, Venue } = require('../models');

// POST api/tickets_post
const createTicket = async (req, res) => {
    try {
        const { venue_id, name, price, available_quantity } = req.body;
        const venue = await Venue.findByPk(venue_id);
        if (!venue) return res.status(404).json({ status: "error", message: "El evento no existe" });

        const newTicket = await Ticket.create({ venue_id, name, price, available_quantity });
        return res.status(201).json({ status: "success", message: "Entrada creada", ticket: newTicket });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error interno", error: error.message });
    }
};

// GET api/tickets_get
const getTickets = async (req, res) => {
    try {
        const { venue_id } = req.query; 
        const tickets = await Ticket.findAll({ where: venue_id ? { venue_id } : {} });
        return res.status(200).json({ status: "success", tickets });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error interno" });
    }
};

// PUT/PATCH api/tickets_modify
const modifyTicket = async (req, res) => {
    try {
        const { ticket_id, name } = req.body;
        const ticket = await Ticket.findByPk(ticket_id);
        if (!ticket) return res.status(404).json({ status: "error", message: "Entrada no encontrada" });

        ticket.name = name || ticket.name;
        await ticket.save();
        return res.status(200).json({ status: "success", message: "Entrada modificada", ticket });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error interno" });
    }
};

module.exports = { createTicket, getTickets, modifyTicket };