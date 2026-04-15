const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Receta = sequelize.define('Receta', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  id_creador: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  id_categoria: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
  titulo: {
    type:      DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título no puede estar vacío' },
      len:      { args: [1, 255], msg: 'El título no puede superar 255 caracteres' },
    },
  },
  descripcion: {
    type:      DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción no puede estar vacía' },
    },
  },
  dificultad: {
    type:         DataTypes.ENUM('facil', 'medio', 'dificil'),
    defaultValue: 'facil',
    allowNull:    false,
  },
  tiempo_prep_minutos: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,    
    validate: {
      min: { args: [0], msg: 'El tiempo de preparación debe ser mayor a 0' },
    },
  },
  tiempo_coccion_minutos: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,    
    validate: {
      min: { args: [0], msg: 'El tiempo de cocción debe ser mayor a 0' },
    },
  },
  porciones: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Las porciones deben ser mayor a 0' },
    },
  },
  url_imagen:   { type: DataTypes.TEXT,    allowNull: true },
  es_destacada: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName:  'Receta',
  timestamps: true,
  createdAt:  'fecha_creacion',
  updatedAt:  'fecha_actualizacion',
});

module.exports = Receta;
