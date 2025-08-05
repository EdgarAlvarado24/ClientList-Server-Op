const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
const customerRoutes = require('./routes/customer-routers.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/customers', customerRoutes);

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Probar la conexión primero
    await testConnection();
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false }); // Cambiar a true para resetear la DB en desarrollo
    console.log('✅ Base de datos sincronizada correctamente.');
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api/customers`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();