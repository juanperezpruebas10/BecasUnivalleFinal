const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { isNotEstudiante } = require('../middlewares/roleMiddleware');
const premioController = require('../controllers/premioController');

router.use(authMiddleware);

router.get('/', premioController.getPremios);
router.get('/estadisticas', premioController.getEstadisticas);
router.post('/', isNotEstudiante, premioController.upload.single('imagen'), premioController.createPremio);
router.put('/:id', isNotEstudiante, premioController.upload.single('imagen'), premioController.updatePremio);
router.delete('/:id', isNotEstudiante, premioController.deletePremio);

module.exports = router;
