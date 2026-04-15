const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const ConfiguracionGlobal = sequelize.define('ConfiguracionGlobal', {
  clave: {
    type:       DataTypes.STRING(100),
    primaryKey: true,
  },
  valor: {
    type:      DataTypes.TEXT,
    allowNull: false,
  },
  descripcion: {
    type:      DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName:  'Configuracion_Global',
  timestamps: false,
});

module.exports = ConfiguracionGlobal;