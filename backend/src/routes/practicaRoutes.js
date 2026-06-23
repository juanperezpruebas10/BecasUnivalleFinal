const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { isNotEstudiante } = require('../middlewares/roleMiddleware');
const practicaController = require('../controllers/practicaController');

router.use(authMiddleware);

router.get('/', practicaController.getPracticas);
router.post(
  '/',
  isNotEstudiante,
  practicaController.upload.single('imagen'),
  practicaController.createPractica
);

module.exports = router;
