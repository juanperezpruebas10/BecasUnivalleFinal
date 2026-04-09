// Verificar que el usuario pueda editar (docente o auxiliar)
const canEdit = (req, res, next) => {
  const { role_id, rol_nombre, id: userId } = req.user;
  
  // Docente (role_id=1) puede editar todo
  if (role_id === 1) {
    return next();
  }
  
  // Auxiliar (role_id=2) puede editar, pero verificaremos después si es su beca
  if (role_id === 2) {
    req.userCanEdit = true;
    return next();
  }
  
  // Estudiante no puede editar
  return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
};

// Verificar que el usuario pueda eliminar su propia beca (auxiliar) o cualquier beca (docente)
const canDelete = async (req, res, next) => {
  const { role_id, id: userId } = req.user;
  const becaId = req.params.id;
  
  // Docente puede eliminar cualquier beca
  if (role_id === 1) {
    return next();
  }
  
  // Auxiliar solo puede eliminar sus propias becas
  if (role_id === 2) {
    const Beca = require('../models/Beca');
    const beca = await Beca.findById(becaId);
    
    if (!beca) {
      return res.status(404).json({ message: 'Beca no encontrada' });
    }
    
    if (beca.creado_por === userId) {
      return next();
    } else {
      return res.status(403).json({ message: 'No puedes eliminar una beca que no fue creada por ti' });
    }
  }
  
  return res.status(403).json({ message: 'No tienes permisos para eliminar becas' });
};

// Verificar que el usuario pueda editar su propia beca
const canEditBeca = async (req, res, next) => {
  const { role_id, id: userId } = req.user;
  const becaId = req.params.id;
  
  // Docente puede editar cualquier beca
  if (role_id === 1) {
    return next();
  }
  
  // Auxiliar solo puede editar sus propias becas
  if (role_id === 2) {
    const Beca = require('../models/Beca');
    const beca = await Beca.findById(becaId);
    
    if (!beca) {
      return res.status(404).json({ message: 'Beca no encontrada' });
    }
    
    if (beca.creado_por === userId) {
      return next();
    } else {
      return res.status(403).json({ message: 'No puedes editar una beca que no fue creada por ti' });
    }
  }
  
  return res.status(403).json({ message: 'No tienes permisos para editar becas' });
};

// Verificar que sea docente (para crear auxiliares)
const isDocente = (req, res, next) => {
  const { role_id } = req.user;
  
  if (role_id === 1) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo docentes pueden realizar esta acción.' });
  }
};

// Verificar que no sea estudiante (para ver acciones de edición)
const isNotEstudiante = (req, res, next) => {
  const { role_id } = req.user;
  
  if (role_id !== 3) {
    next();
  } else {
    res.status(403).json({ message: 'Los estudiantes solo pueden visualizar becas' });
  }
};

module.exports = { canEdit, canDelete, canEditBeca, isDocente, isNotEstudiante };