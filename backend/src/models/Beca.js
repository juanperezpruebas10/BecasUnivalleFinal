const pool = require('../config/database');

class Beca {
  // Hacer columnas del paso 2 opcionales si existen con NOT NULL
  static async ensureNullableColumns() {
    const alterColumns = [
      "ALTER TABLE becas MODIFY COLUMN fecha_apertura DATE NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN fecha_cierre DATE NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN duracion VARCHAR(100) NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN nivel_estudio VARCHAR(100) NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN idioma_requerido VARCHAR(100) NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN edad_minima INT NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN edad_maxima INT NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN requisitos TEXT NULL DEFAULT NULL",
      "ALTER TABLE becas MODIFY COLUMN plazas_disponibles INT NULL DEFAULT NULL",
    ];
    for (const sql of alterColumns) {
      try { await pool.execute(sql); } catch (_) {}
    }
  }

  // Crear beca
  static async create(becaData, userId) {
    await this.ensureNullableColumns();
    const { tipo, titulo, institucion, pais, area, descripcion, linkOficial, logo } = becaData;

    const [result] = await pool.execute(
      `INSERT INTO becas (tipo, titulo, institucion, pais, area, descripcion, link_oficial, logo, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tipo, titulo, institucion, pais, area || null, descripcion || null, linkOficial || null, logo || null, userId]
    );

    return result.insertId;
  }

  // Obtener todas las becas activas (con nombre del creador)
static async findAll(filters = {}) {
  let query = `
    SELECT b.*, 
           CONCAT(u.nombre, ' ', u.apellido) as creador_nombre
    FROM becas b
    LEFT JOIN usuarios u ON b.creado_por = u.id
    WHERE b.activo = 1
  `;
  const params = [];

  if (filters.tipo) {
    query += ` AND b.tipo = ?`;
    params.push(filters.tipo);
  }

  if (filters.pais) {
    query += ` AND b.pais LIKE ?`;
    params.push(`%${filters.pais}%`);
  }

  query += ` ORDER BY b.created_at DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
}

  // Obtener becas por usuario (para auxiliares ver solo las suyas)
static async findAllByUser(userId, filters = {}) {
  let query = `
    SELECT b.*, 
           CONCAT(u.nombre, ' ', u.apellido) as creador_nombre
    FROM becas b
    LEFT JOIN usuarios u ON b.creado_por = u.id
    WHERE b.activo = 1 AND b.creado_por = ?
  `;
  const params = [userId];

  if (filters.tipo) {
    query += ` AND b.tipo = ?`;
    params.push(filters.tipo);
  }

  if (filters.pais) {
    query += ` AND b.pais LIKE ?`;
    params.push(`%${filters.pais}%`);
  }

  query += ` ORDER BY b.created_at DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
}

// Obtener becas para estudiantes (solo datos básicos)
static async findAllForStudents() {
  const [rows] = await pool.execute(
    `SELECT b.id, b.titulo, b.tipo, b.institucion, b.pais, b.area, b.link_oficial, b.logo, b.visitas, 
            b.fecha_apertura, b.fecha_cierre, b.plazas_disponibles, b.created_at,
            CONCAT(u.nombre, ' ', u.apellido) as creador_nombre
     FROM becas b
     LEFT JOIN usuarios u ON b.creado_por = u.id
     WHERE b.activo = 1
     ORDER BY b.created_at DESC`
  );
  return rows;
}

// Obtener beca por ID
static async findById(id) {
  const [rows] = await pool.execute(
    `SELECT b.*, 
            CONCAT(u.nombre, ' ', u.apellido) as creador_nombre
     FROM becas b
     LEFT JOIN usuarios u ON b.creado_por = u.id
     WHERE b.id = ? AND b.activo = 1`,
    [id]
  );
  return rows[0];
}

  // Incrementar visitas
  static async incrementVisitas(id) {
    await pool.execute(
      `UPDATE becas SET visitas = visitas + 1 WHERE id = ?`,
      [id]
    );
  }

  // Actualizar beca
  static async update(id, becaData, userId) {
    const { tipo, titulo, institucion, pais, area, descripcion, linkOficial, logo } = becaData;

    const [result] = await pool.execute(
      `UPDATE becas SET
        tipo = ?, titulo = ?, institucion = ?, pais = ?, area = ?, descripcion = ?,
        link_oficial = ?, logo = ?, modificado_por = ?
       WHERE id = ?`,
      [tipo, titulo, institucion, pais, area || null, descripcion || null, linkOficial || null, logo || null, userId, id]
    );

    return result.affectedRows > 0;
  }

  // Eliminar beca (soft delete)
  static async delete(id) {
    const [result] = await pool.execute(
      `UPDATE becas SET activo = 0 WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  // Obtener estadísticas para dashboard
  static async getEstadisticas() {
    const [rows] = await pool.execute(
      `SELECT 
        (SELECT COUNT(*) FROM becas WHERE activo = 1) as total_becas,
        (SELECT COUNT(*) FROM becas WHERE activo = 1 AND fecha_cierre >= CURDATE()) as becas_activas,
        (SELECT IFNULL((SELECT COUNT(*) FROM premios_internacionales WHERE activo = 1), 0)) as total_estudiantes,
        (SELECT COUNT(DISTINCT pais) FROM becas WHERE activo = 1) as paises_disponibles`
    );
    return rows[0];
  }

  // Obtener becas por tipo (para gráfico)
  static async getBecasPorTipo() {
    const [rows] = await pool.execute(
      `SELECT tipo, COUNT(*) as cantidad FROM becas WHERE activo = 1 GROUP BY tipo`
    );
    return rows;
  }

  // Obtener becas más visitadas
  static async getMasVisitadas(limit = 5) {
    const [rows] = await pool.execute(
      `SELECT id, titulo, institucion, pais, visitas, tipo, link_oficial
       FROM becas
       WHERE activo = 1
       ORDER BY visitas DESC
       LIMIT ${parseInt(limit)}`
    );
    return rows;
  }

  // Obtener convocatorias recientes
  static async getConvocatoriasRecientes(limit = 4) {
    const [rows] = await pool.execute(
      `SELECT id, titulo, fecha_cierre, plazas_disponibles,
        CASE 
          WHEN fecha_cierre >= CURDATE() THEN 'activa'
          ELSE 'proxima'
        END as estado
       FROM becas 
       WHERE activo = 1 
       ORDER BY fecha_cierre ASC 
       LIMIT ${parseInt(limit)}`
    );
    return rows;
  }
}

module.exports = Beca;
