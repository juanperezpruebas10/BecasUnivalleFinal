const pool = require('../config/database');

class PremioInternacional {
  static async ensureTable() {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS premios_internacionales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        premio VARCHAR(255) NOT NULL,
        ambito ENUM('nacional', 'internacional') NOT NULL DEFAULT 'internacional',
        carrera VARCHAR(255) NOT NULL,
        miembros TEXT NOT NULL,
        link VARCHAR(500) NULL,
        imagen VARCHAR(255) NULL,
        fecha DATE NULL,
        creado_por INT NULL,
        activo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_premios_activo_created (activo, created_at)
      )
    `);
    // Agregar columna fecha si no existe (para tablas ya creadas)
    try {
      await pool.execute(`ALTER TABLE premios_internacionales ADD COLUMN fecha DATE NULL`);
    } catch (_) {}
  }

  static async create({ titulo, premio, ambito, carrera, miembros, link, imagen, fecha }, userId) {
    await this.ensureTable();
    const [result] = await pool.execute(
      `INSERT INTO premios_internacionales (titulo, premio, ambito, carrera, miembros, link, imagen, fecha, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, premio, ambito, carrera, miembros, link || null, imagen || null, fecha || null, userId]
    );
    return result.insertId;
  }

  static async findById(id) {
    await this.ensureTable();
    const [rows] = await pool.execute(
      `SELECT * FROM premios_internacionales WHERE id = ? AND activo = 1`,
      [id]
    );
    return rows[0] || null;
  }

  static async findAll() {
    await this.ensureTable();
    const [rows] = await pool.execute(
      `SELECT p.*, CONCAT(u.nombre, ' ', u.apellido) as creador_nombre
       FROM premios_internacionales p
       LEFT JOIN usuarios u ON p.creado_por = u.id
       WHERE p.activo = 1
       ORDER BY p.fecha DESC, p.created_at DESC`
    );
    return rows;
  }

  static async update(id, { titulo, premio, ambito, carrera, miembros, link, imagen, fecha }) {
    await this.ensureTable();
    const [result] = await pool.execute(
      `UPDATE premios_internacionales SET
         titulo = ?, premio = ?, ambito = ?, carrera = ?,
         miembros = ?, link = ?, imagen = ?, fecha = ?
       WHERE id = ? AND activo = 1`,
      [titulo, premio, ambito, carrera, miembros, link || null, imagen || null, fecha || null, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    await this.ensureTable();
    const [result] = await pool.execute(
      `UPDATE premios_internacionales SET activo = 0 WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getEstadisticas() {
    await this.ensureTable();
    const [porCarrera] = await pool.execute(
      `SELECT carrera, COUNT(*) as cantidad FROM premios_internacionales
       WHERE activo = 1 GROUP BY carrera ORDER BY cantidad DESC`
    );
    const [porAmbito] = await pool.execute(
      `SELECT ambito, COUNT(*) as cantidad FROM premios_internacionales
       WHERE activo = 1 GROUP BY ambito`
    );
    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) as total FROM premios_internacionales WHERE activo = 1`
    );
    return { porCarrera, porAmbito, total };
  }
}

module.exports = PremioInternacional;
