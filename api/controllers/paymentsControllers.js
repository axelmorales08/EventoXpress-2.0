const { PaymentsMethods } = require('../models');

const createPayment = async (req, res) => {
    try {
        // El modelo pide types_payment_methods_id, user_id, responsible, number, expiration, CVV
        const newPayment = await PaymentsMethods.create(req.body);
        return res.status(201).json({ status: "success", message: "Método de pago registrado correctamente", id: newPayment.id });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

const getPayments = async (req, res) => {
    try {
        const { user_id } = req.query; 
        const methods = await PaymentsMethods.findAll({ where: user_id ? { user_id } : {} });
        return res.status(200).json({ status: "success", metodos_pago: methods });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { createPayment, getPayments };