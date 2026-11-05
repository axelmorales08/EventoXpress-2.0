const express = require('express');
const router = express.Router();
const ticketsControllers = require('../controllers/ticketsControllers');

router.post('/tickets_post', ticketsControllers.createTicket);
router.get('/tickets_get', ticketsControllers.getTickets);
router.put('/tickets_modify', ticketsControllers.modifyTicket);

module.exports = router;