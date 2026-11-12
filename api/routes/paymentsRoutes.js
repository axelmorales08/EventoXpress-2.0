const express = require('express');
const router = express.Router();
const payControllers = require('../controllers/paymentsControllers');

router.post('/methodPayment_post', payControllers.createPayment);
router.get('/methodPayment_get', payControllers.getPayments);

module.exports = router;