const Beca = require('../models/Beca');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Obtener todas las becas
const getAllBecas = async (req, res) => {
  try {
    const { role_id, id: userId, rol_nombre } = req.user;
    
    console.log('=== getAllBecas ===');
    console.log('Rol del usuario:', rol_nombre, 'role_id:', role_id);
    
    let becas;
    
    if (role_id === 3) {
      becas = await Beca.findAllForStudents();
    } else {
      becas = await Beca.findAll(req.query);
    }
    
    console.log(`✅ Becas encontradas: ${becas.length}`);
    res.json(becas);
  } catch (error) {
    console.error('❌ Error en getAllBecas:', error);
    res.status(500).json({ message: 'Error al obtener becas' });
  }
};

// Obtener solo las becas del usuario actual (para auxiliares en reportes)
const getMisBecas = async (req, res) => {
  try {
    const { role_id, id: userId, rol_nombre } = req.user;
    
    console.log('=== getMisBecas ===');
    console.log('Usuario:', rol_nombre, 'ID:', userId);
    
    // Solo auxiliares y docentes pueden ver sus becas
    if (role_id !== 1 && role_id !== 2) {
      console.log('❌ Permiso denegado - solo docentes y auxiliares pueden ver sus becas');
      return res.status(403).json({ message: 'No tienes permisos para ver esta información' });
    }
    
    const becas = await Beca.findAllByUser(userId, req.query);
    console.log(`✅ Becas encontradas para ${rol_nombre}: ${becas.length}`);
    
    res.json(becas);
  } catch (error) {
    console.error('❌ Error en getMisBecas:', error);
    res.status(500).json({ message: 'Error al obtener tus becas' });
  }
};

// Obtener una beca por ID
const getBecaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, rol_nombre } = req.user;
    
    if (role_id === 3) {
      await Beca.incrementVisitas(id);
      console.log(`📊 Visita registrada: Beca ID ${id} por estudiante`);
    } else {
      console.log(`👁️ Visualización sin conteo: Beca ID ${id} por ${rol_nombre}`);
    }
    
    let beca;
    if (role_id === 3) {
      const becas = await Beca.findAllForStudents();
      beca = becas.find(b => b.id == id);
    } else {
      beca = await Beca.findById(id);
    }
    
    if (!beca) {
      return res.status(404).json({ message: 'Beca no encontrada' });
    }
    
    res.json(beca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener beca' });
  }
};

// Crear nueva beca
const createBeca = async (req, res) => {
  try {
    const { role_id, rol_nombre } = req.user;
    
    if (role_id !== 1 && role_id !== 2) {
      return res.status(403).json({ message: 'No tienes permisos para crear becas' });
    }
    
    const becaData = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    
    const becaId = await Beca.create({ ...becaData, logo }, req.user.id);
    
    console.log(`✅ Beca creada por ${rol_nombre} con ID: ${becaId}`);
    res.status(201).json({ message: 'Beca creada exitosamente', id: becaId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear beca' });
  }
};

// Actualizar beca
const updateBeca = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, id: userId } = req.user;
    
    if (role_id !== 1 && role_id !== 2) {
      return res.status(403).json({ message: 'No tienes permisos para editar becas' });
    }
    
    const becaExistente = await Beca.findById(id);
    if (!becaExistente) {
      return res.status(404).json({ message: 'Beca no encontrada' });
    }
    
    if (role_id === 2 && becaExistente.creado_por !== userId) {
      return res.status(403).json({ message: 'No puedes editar una beca que no fue creada por ti' });
    }
    
    const becaData = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : becaExistente.logo;
    
    const updated = await Beca.update(id, { ...becaData, logo }, userId);
    
    if (updated) {
      res.json({ message: 'Beca actualizada exitosamente' });
    } else {
      res.status(400).json({ message: 'No se pudo actualizar la beca' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar beca' });
  }
};

// Eliminar beca
const deleteBeca = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id, id: userId } = req.user;
    
    if (role_id !== 1) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar becas' });
    }
    
    const becaExistente = await Beca.findById(id);
    if (!becaExistente) {
      return res.status(404).json({ message: 'Beca no encontrada' });
    }
    
    const deleted = await Beca.delete(id);
    
    if (deleted) {
      res.json({ message: 'Beca eliminada exitosamente' });
    } else {
      res.status(400).json({ message: 'No se pudo eliminar la beca' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar beca' });
  }
};

// Obtener estadísticas
const getEstadisticas = async (req, res) => {
  try {
    const stats = await Beca.getEstadisticas();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// Obtener datos para gráficos
const getGraficos = async (req, res) => {
  try {
    const becasPorTipo = await Beca.getBecasPorTipo();
    const masVisitadas = await Beca.getMasVisitadas(5);
    const convocatorias = await Beca.getConvocatoriasRecientes(4);
    
    res.json({
      becasPorTipo,
      masVisitadas,
      convocatorias
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener datos de gráficos' });
  }
};

module.exports = {
  getAllBecas,
  getMisBecas,
  getBecaById,
  createBeca,
  updateBeca,
  deleteBeca,
  getEstadisticas,
  getGraficos,
  upload
};