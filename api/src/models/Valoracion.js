const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Valoracion = sequelize.define('Valoracion', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  id_usuario: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  id_receta: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  puntuacion: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La puntuación mínima es 1' },
      max: { args: [5], msg: 'La puntuación máxima es 5' },
    },
  },
  comentario: {
    type:      DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName:  'Valoracion',
  timestamps: true,
  createdAt:  'fecha_creacion',
  updatedAt:  false,
});

module.exports = Valoracion;
