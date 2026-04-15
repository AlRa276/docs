const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Favorito = sequelize.define('Favorito', {
  id_usuario: {
    type:       DataTypes.INTEGER,
    allowNull:  false,
    primaryKey: true,
  },
  id_receta: {
    type:       DataTypes.INTEGER,
    allowNull:  false,
    primaryKey: true,
  },
}, {
  tableName:  'Favorito',
  timestamps: true,
  createdAt:  'fecha_guardado',
  updatedAt:  false,
});

module.exports = Favorito;
