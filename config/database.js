const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verificar que las variables de entorno estén definidas
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
  console.error('📝 Crea un archivo .env con las siguientes variables:');
  console.error('DB_NAME=tu_nombre_de_base_de_datos');
  console.error('DB_USER=tu_usuario');
  console.error('DB_PASSWORD=tu_password');
  console.error('DB_HOST=tu_host.neon.tech');
  console.error('DB_PORT=5432 (opcional)');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.error('🔧 Verifica tu configuración en el archivo .env');
  }
};

module.exports = { sequelize, testConnection };