const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Ingrediente = sequelize.define('Ingrediente', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  id_receta: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type:      DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del ingrediente no puede estar vacío' },
    },
  },
  cantidad: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0.01], msg: 'La cantidad debe ser mayor a 0' },
    },
  },
  unidad: {
    type:      DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'gramos',
    validate: {
      notEmpty: { msg: 'La unidad no puede estar vacía' },
    },
  },
}, {
  tableName:  'Ingrediente',
  timestamps: false,
});

module.exports = Ingrediente;
