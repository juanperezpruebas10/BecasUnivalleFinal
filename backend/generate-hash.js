const bcrypt = require('bcryptjs');

const generateHash = async () => {
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);
  console.log('Contraseña:', password);
  console.log('Hash generado:', hash);
  console.log('\nCopia estos hashes a tu base de datos:');
  console.log('=====================================');
  console.log(`UPDATE usuarios SET password = '${hash}' WHERE email = 'admin@docent.univalle.edu';`);
  console.log(`UPDATE usuarios SET password = '${hash}' WHERE email = 'juan@aux.univalle.edu';`);
};

generateHash();