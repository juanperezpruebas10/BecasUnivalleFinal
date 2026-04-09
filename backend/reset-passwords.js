const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const resetPasswords = async () => {
  try {
    // Configuración de la base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Univalle',
      database: 'sistema_becas'
    });
    
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Hash generado:', hashedPassword);
    
    // Actualizar contraseñas
    await connection.execute(
      `UPDATE usuarios SET password = ? WHERE email = ?`,
      [hashedPassword, 'admin@docent.univalle.edu']
    );
    
    await connection.execute(
      `UPDATE usuarios SET password = ? WHERE email = ?`,
      [hashedPassword, 'juan@aux.univalle.edu']
    );
    
    console.log('✅ Contraseñas actualizadas correctamente');
    
    // Verificar
    const [rows] = await connection.execute(
      `SELECT email, LEFT(password, 20) as hash_prefix FROM usuarios WHERE email IN ('admin@docent.univalle.edu', 'juan@aux.univalle.edu')`
    );
    console.log('Verificación:', rows);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPasswords();