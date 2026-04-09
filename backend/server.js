const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const becaRoutes = require('./src/routes/becaRoutes');
const auxiliarRoutes = require('./src/routes/auxiliarRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/becas', becaRoutes);
app.use('/api/auxiliares', auxiliarRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API del Sistema de Becas Univalle funcionando' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});