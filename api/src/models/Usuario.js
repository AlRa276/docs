const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const bcrypt        = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  nombre_mostrar: {
    type:      DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'usuario',
    validate: {
      len:      { args: [1, 255], msg: 'El nombre no puede superar 255 caracteres' },
    },
  },
  correo_electronico: {
    type:      DataTypes.STRING(255),
    allowNull: true,
    unique:    true,
    validate: {
      isEmail: { msg: 'El correo electrónico no es válido' },
    },
  },
  password_hash: {
    type:      DataTypes.STRING(255),
    allowNull: true,
  },
  url_foto:  { type: DataTypes.TEXT, allowNull: true },
  biografia: { type: DataTypes.TEXT, allowNull: true },
  rol: {
    type:         DataTypes.ENUM('usuario', 'admin'),
    defaultValue: 'usuario',
  },
}, {
  tableName:  'Usuario',
  timestamps: true,
  createdAt:  'fecha_creacion',
  updatedAt:  false,
  hooks: {
    // Hashear la contraseña automáticamente antes de crear o actualizar
    beforeCreate: async (usuario) => {
      if (usuario.password_hash) {
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password_hash') && usuario.password_hash) {
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
      }
    },
  },
});

// Método de instancia para comparar contraseñas
Usuario.prototype.verificarPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password_hash);
};

module.exports = Usuario;
