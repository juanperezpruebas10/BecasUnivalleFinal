// Validador de emails por dominio
const validateEmailByRole = (email) => {
  // Docente: debe terminar en @docent.univalle.edu
  if (email.endsWith('@docent.univalle.edu')) {
    return { role: 'docente', isValid: true };
  }
  
  // Auxiliar: debe terminar en @aux.univalle.edu
  if (email.endsWith('@aux.univalle.edu')) {
    return { role: 'auxiliar', isValid: true };
  }
  
  // Estudiante: debe terminar en @est.univalle.edu
  if (email.endsWith('@est.univalle.edu')) {
    return { role: 'estudiante', isValid: true };
  }
  
  return { role: null, isValid: false };
};

// Obtener role_id basado en el rol
const getRoleId = (role) => {
  const roles = {
    'docente': 1,
    'auxiliar': 2,
    'estudiante': 3
  };
  return roles[role] || 3;
};

module.exports = { validateEmailByRole, getRoleId };