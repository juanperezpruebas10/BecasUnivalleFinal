const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { validateEmailByRole, getRoleId } = require('../utils/emailValidator');

class User {
  // Crear usuario (solo para registro de auxiliares)
  static async create(userData) {
    const { nombre, apellido, email, password, telefono, departamento, foto_perfil, role_id } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      `INSERT INTO usuarios (nombre, apellido, email, password, telefono, departamento, foto_perfil, role_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido || '', email, hashedPassword, telefono || '', departamento || '', foto_perfil || null, role_id]
    );
    
    return result.insertId;
  }

  // Buscar usuario por email (para login)
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND u.activo = 1`,
      [email]
    );
    return rows[0];
  }

  // Validar login por dominio de email (para estudiantes)
  static async validateAndGetRoleByEmail(email) {
    const validation = validateEmailByRole(email);
    
    if (!validation.isValid) {
      return null;
    }
    
    // Buscar si el usuario ya existe
    let user = await this.findByEmail(email);
    
    // Si no existe, crear usuario automáticamente (para estudiantes)
    if (!user) {
      const role_id = getRoleId(validation.role);
      const nombre = email.split('@')[0];
      
      const [result] = await pool.execute(
        `INSERT INTO usuarios (nombre, email, password, role_id) 
         VALUES (?, ?, ?, ?)`,
        [nombre, email, 'auto_generated', role_id]
      );
      
      user = await this.findByEmail(email);
    }
    
    return user;
  }

  // Obtener usuario por ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Actualizar último acceso
  static async updateLastAccess(id) {
    await pool.execute(
      `UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?`,
      [id]
    );
  }
}

module.exports = User;