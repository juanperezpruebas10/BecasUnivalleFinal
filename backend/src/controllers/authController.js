const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login general
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Intento de login:', { email, passwordProvided: !!password });
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Verificar si es un estudiante (login automático por dominio)
    if (email.endsWith('@est.univalle.edu')) {
      console.log('Login como estudiante:', email);
      const user = await User.validateAndGetRoleByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: 'Dominio de email no válido' });
      }
      
      await User.updateLastAccess(user.id);
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.rol_nombre },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      
      return res.json({
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol_nombre
        }
      });
    }
    
    // Para docentes y auxiliares, validar contraseña
    const user = await User.findByEmail(email);
    
    console.log('Usuario encontrado:', user ? { id: user.id, email: user.email, role: user.rol_nombre } : 'No encontrado');
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Contraseña válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    await User.updateLastAccess(user.id);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol_nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol_nombre,
        foto_perfil: user.foto_perfil
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol_nombre,
      telefono: user.telefono,
      departamento: user.departamento,
      foto_perfil: user.foto_perfil
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

module.exports = { login, getProfile };