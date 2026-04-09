const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta de login
router.post('/login', login);

// Ruta de perfil (requiere autenticación)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;