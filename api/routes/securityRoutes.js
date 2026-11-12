const express = require('express');
const router = express.Router();
const secControllers = require('../controllers/securityControllers');

router.post('/medidas-seguridad', secControllers.createMeasure);
router.get('/medidas-seguridad', secControllers.getMeasure);
router.put('/medidas-seguridad', secControllers.updateMeasure);

module.exports = router;