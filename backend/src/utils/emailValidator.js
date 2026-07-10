// Validador de emails por dominio

// Dominios que se consideran "estudiante" (login automático, sin contraseña)
const STUDENT_DOMAINS = [
  '@est.univalle.edu',
  '@alumni.univalle.edu',
  '@univalle.edu'
];

const validateEmailByRole = (email) => {
  // Docente: debe terminar en @docent.univalle.edu
  if (email.endsWith('@docent.univalle.edu')) {
    return { role: 'docente', isValid: true };
  }
  
  // Auxiliar: debe terminar en @aux.univalle.edu
  if (email.endsWith('@aux.univalle.edu')) {
    return { role: 'auxiliar', isValid: true };
  }
  
  // Estudiante / persona común: cualquiera de los dominios de STUDENT_DOMAINS
  if (STUDENT_DOMAINS.some(domain => email.endsWith(domain))) {
    return { role: 'estudiante', isValid: true };
  }
  
  return { role: null, isValid: false };
};

// Devuelve true si el email pertenece a alguno de los dominios de estudiante
const isStudentDomain = (email) => {
  return STUDENT_DOMAINS.some(domain => email.endsWith(domain));
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

module.exports = { validateEmailByRole, getRoleId, isStudentDomain, STUDENT_DOMAINS };
