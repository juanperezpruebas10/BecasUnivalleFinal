const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PremioInternacional = require('../models/PremioInternacional');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `premio-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype))
      return cb(null, true);
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
});

const getPremios = async (req, res) => {
  try {
    const premios = await PremioInternacional.findAll();
    res.json(premios);
  } catch (error) {
    console.error('Error al obtener premios:', error);
    res.status(500).json({ message: 'Error al obtener premios internacionales' });
  }
};

const createPremio = async (req, res) => {
  try {
    const { titulo, premio, ambito, carrera, miembros, link, fecha } = req.body;
    if (!titulo?.trim() || !premio?.trim() || !ambito || !carrera?.trim() || !miembros?.trim())
      return res.status(400).json({ message: 'Título, premio, ámbito, carrera y miembros son requeridos' });
    if (!['nacional', 'internacional'].includes(ambito))
      return res.status(400).json({ message: 'El ámbito debe ser nacional o internacional' });

    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const id = await PremioInternacional.create(
      { titulo: titulo.trim(), premio: premio.trim(), ambito, carrera: carrera.trim(),
        miembros: miembros.trim(), link: link?.trim() || null, imagen, fecha: fecha || null },
      req.user.id
    );
    res.status(201).json({ message: 'Premio registrado exitosamente', id });
  } catch (error) {
    console.error('Error al crear premio:', error);
    res.status(500).json({ message: 'Error al crear premio internacional' });
  }
};

const updatePremio = async (req, res) => {
  try {
    const { id } = req.params;
    const existente = await PremioInternacional.findById(id);
    if (!existente) return res.status(404).json({ message: 'Premio no encontrado' });

    const { titulo, premio, ambito, carrera, miembros, link, fecha } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : existente.imagen;

    const updated = await PremioInternacional.update(id, {
      titulo: titulo?.trim() || existente.titulo,
      premio: premio?.trim() || existente.premio,
      ambito: ambito || existente.ambito,
      carrera: carrera?.trim() || existente.carrera,
      miembros: miembros?.trim() || existente.miembros,
      link: link?.trim() || null,
      imagen,
      fecha: fecha || null
    });

    if (updated) res.json({ message: 'Premio actualizado exitosamente' });
    else res.status(400).json({ message: 'No se pudo actualizar el premio' });
  } catch (error) {
    console.error('Error al actualizar premio:', error);
    res.status(500).json({ message: 'Error al actualizar premio' });
  }
};

const deletePremio = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PremioInternacional.delete(id);
    if (deleted) res.json({ message: 'Premio eliminado exitosamente' });
    else res.status(404).json({ message: 'Premio no encontrado' });
  } catch (error) {
    console.error('Error al eliminar premio:', error);
    res.status(500).json({ message: 'Error al eliminar premio' });
  }
};

const getEstadisticas = async (req, res) => {
  try {
    const estadisticas = await PremioInternacional.getEstadisticas();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

module.exports = { getPremios, createPremio, updatePremio, deletePremio, getEstadisticas, upload };
