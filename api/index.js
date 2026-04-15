require('dotenv').config();
const app               = require('./app');
const { sequelize }     = require('./src/models');
const cors    = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173'],
}));
// Verifica la conexion a la BD antes de iniciar el servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize:', process.env.DB_NAME);
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`   Health check → http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });
