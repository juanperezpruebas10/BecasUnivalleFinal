const pool = require('../config/database');

class PracticaInternacional {
  static async ensureTable() {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS practicas_internacionales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imagen VARCHAR(255) NOT NULL,
        texto TEXT NOT NULL,
        creado_por INT NULL,
        activo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_practicas_activo_created (activo, created_at)
      )
    `);
  }

  static async create({ imagen, texto }, userId) {
    await this.ensureTable();
    const [result] = await pool.execute(
      `INSERT INTO practicas_internacionales (imagen, texto, creado_por) VALUES (?, ?, ?)`,
      [imagen, texto, userId]
    );
    return result.insertId;
  }

  static async findAll() {
    await this.ensureTable();
    const [rows] = await pool.execute(
      `SELECT p.*, CONCAT(u.nombre, ' ', u.apellido) as creador_nombre
       FROM practicas_internacionales p
       LEFT JOIN usuarios u ON p.creado_por = u.id
       WHERE p.activo = 1
       ORDER BY p.created_at DESC`
    );
    return rows;
  }
}

module.exports = PracticaInternacional;
