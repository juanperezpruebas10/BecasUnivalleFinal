-- Esquema base del Sistema de Becas Univalle
-- Las tablas practicas_internacionales y premios_internacionales se crean
-- automáticamente desde el backend (PracticaInternacional.js / PremioInternacional.js).

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (id, nombre) VALUES
  (1, 'docente'),
  (2, 'auxiliar'),
  (3, 'estudiante')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL DEFAULT '',
  departamento VARCHAR(255) NOT NULL DEFAULT '',
  foto_perfil VARCHAR(255) DEFAULT NULL,
  role_id INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  ultimo_acceso DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS becas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  institucion VARCHAR(255) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  area VARCHAR(100) DEFAULT NULL,
  descripcion TEXT DEFAULT NULL,
  link_oficial VARCHAR(500) DEFAULT NULL,
  logo VARCHAR(255) DEFAULT NULL,
  fecha_apertura DATE DEFAULT NULL,
  fecha_cierre DATE DEFAULT NULL,
  duracion VARCHAR(100) DEFAULT NULL,
  nivel_estudio VARCHAR(100) DEFAULT NULL,
  idioma_requerido VARCHAR(100) DEFAULT NULL,
  edad_minima INT DEFAULT NULL,
  edad_maxima INT DEFAULT NULL,
  requisitos TEXT DEFAULT NULL,
  plazas_disponibles INT DEFAULT NULL,
  visitas INT NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_por INT DEFAULT NULL,
  modificado_por INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_becas_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios(id),
  CONSTRAINT fk_becas_modificado_por FOREIGN KEY (modificado_por) REFERENCES usuarios(id)
);

-- Usuarios de prueba (contraseña: 123456)
INSERT INTO usuarios (nombre, apellido, email, password, role_id)
VALUES ('Admin', 'Univalle', 'admin@docent.univalle.edu', '$2a$10$7kP2eTPTB5NaCOPf8QOLruyPmYCeN7xE/.yDK07RKUonEiqf7ok4e', 1)
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO usuarios (nombre, apellido, email, password, role_id)
VALUES ('Juan', 'Auxiliar', 'juan@aux.univalle.edu', '$2a$10$7kP2eTPTB5NaCOPf8QOLruyPmYCeN7xE/.yDK07RKUonEiqf7ok4e', 2)
ON DUPLICATE KEY UPDATE email = email;
