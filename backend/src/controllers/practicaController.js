const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PracticaInternacional = require('../models/PracticaInternacional');

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `practica-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }

    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
});

const getPracticas = async (req, res) => {
  try {
    const practicas = await PracticaInternacional.findAll();
    res.json(practicas);
  } catch (error) {
    console.error('Error al obtener prácticas internacionales:', error);
    res.status(500).json({ message: 'Error al obtener prácticas internacionales' });
  }
};

const createPractica = async (req, res) => {
  try {
    const { role_id } = req.user;

    if (role_id !== 1 && role_id !== 2) {
      return res.status(403).json({ message: 'No tienes permisos para crear prácticas internacionales' });
    }

    const texto = req.body.texto?.trim();
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imagen || !texto) {
      return res.status(400).json({ message: 'La foto y el texto son requeridos' });
    }

    const id = await PracticaInternacional.create({ imagen, texto }, req.user.id);
    res.status(201).json({ message: 'Práctica internacional creada exitosamente', id });
  } catch (error) {
    console.error('Error al crear práctica internacional:', error);
    res.status(500).json({ message: 'Error al crear práctica internacional' });
  }
};

module.exports = {
  getPracticas,
  createPractica,
  upload
};
