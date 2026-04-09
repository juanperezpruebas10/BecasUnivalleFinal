const express = require('express');
const router = express.Router();
const becaController = require('../controllers/becaController');
const authMiddleware = require('../middlewares/authMiddleware');
const { canEdit, canDelete, canEditBeca, isNotEstudiante } = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de visualización
router.get('/', becaController.getAllBecas);
router.get('/mis-becas', becaController.getMisBecas); // ← ESTA RUTA
router.get('/estadisticas', becaController.getEstadisticas);
router.get('/graficos', becaController.getGraficos);
router.get('/:id', becaController.getBecaById);

// Rutas de edición (solo docente y auxiliar)
router.post('/', canEdit, isNotEstudiante, becaController.upload.single('logo'), becaController.createBeca);
router.put('/:id', canEdit, canEditBeca, becaController.upload.single('logo'), becaController.updateBeca);

// Eliminación (docente puede todas, auxiliar solo las suyas)
router.delete('/:id', canDelete, becaController.deleteBeca);

module.exports = router;