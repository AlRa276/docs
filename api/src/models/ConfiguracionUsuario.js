const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const ConfiguracionUsuario = sequelize.define('ConfiguracionUsuario', {
  id_usuario: {
    type:       DataTypes.INTEGER,
    primaryKey: true,
  },
  recibir_emails: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sistema_medidas: {
    type:         DataTypes.ENUM('metrico', 'imperial'),
    defaultValue: 'metrico',
  },
  tema_oscuro: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName:  'Configuracion_Usuario',
  timestamps: false,
});

module.exports = ConfiguracionUsuario;