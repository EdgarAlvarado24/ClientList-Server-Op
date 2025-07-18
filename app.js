const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const customerRoutes = require('./routes/customer-routers.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/customers', customerRoutes);

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }) // Cambiar a true para resetear la DB en desarrollo
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });