const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const { isDocente } = require('../middlewares/roleMiddleware');
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');

// Configuración de multer para fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear nuevo auxiliar (SOLO DOCENTE)
router.post('/', isDocente, upload.single('foto'), async (req, res) => {
  try {
    const { nombre, email, password, telefono, departamento } = req.body;
    const foto_perfil = req.file ? `/uploads/${req.file.filename}` : null;
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    if (!email.endsWith('@aux.univalle.edu')) {
      return res.status(400).json({ message: 'El email debe terminar en @aux.univalle.edu' });
    }
    
    const role_id = 2;
    
    const userId = await User.create({
      nombre,
      apellido: '',
      email,
      password,
      telefono,
      departamento,
      foto_perfil,
      role_id
    });
    
    res.status(201).json({ message: 'Auxiliar creado exitosamente', id: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear auxiliar' });
  }
});

// Obtener todos los auxiliares (SOLO DOCENTE)
router.get('/', isDocente, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, nombre, email, telefono, departamento, foto_perfil, created_at 
       FROM usuarios WHERE role_id = 2`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener auxiliares' });
  }
});

// Eliminar auxiliar (SOLO DOCENTE)
router.delete('/:id', isDocente, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute(
      `DELETE FROM usuarios WHERE id = ? AND role_id = 2`,
      [id]
    );
    res.json({ message: 'Auxiliar eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar auxiliar' });
  }
});

module.exports = router;