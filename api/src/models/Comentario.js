const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Comentario = sequelize.define('Comentario', {
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
  id_respuesta_a: {
    type:      DataTypes.INTEGER,
    allowNull: true,
  },
  texto: {
    type:      DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El comentario no puede estar vacío' },
    },
  },
}, {
  tableName:  'Comentario',
  timestamps: true,
  createdAt:  'fecha_creacion',
  updatedAt:  false,
});

module.exports = Comentario;
