const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Categoria = sequelize.define('Categoria', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  nombre: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    unique:    true,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' },
      len:      { args: [1, 100], msg: 'El nombre no puede superar 100 caracteres' },
    },
  },
  icono: {
    type:      DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName:  'Categoria',
  timestamps: true,
  createdAt:  'fecha_creacion',
  updatedAt:  false,
});

module.exports = Categoria;
