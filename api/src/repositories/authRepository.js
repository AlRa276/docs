const { Usuario } = require('../models');

// Busca usuario por correo incluyendo password_hash (normalmente excluido)
const obtenerPorCorreoConPassword = (correo) =>
  Usuario.findOne({
    where:      { correo_electronico: correo },
    attributes: ['id', 'nombre_mostrar', 'correo_electronico', 'password_hash', 'rol', 'url_foto'],
  });

const obtenerPorId = (id) =>
  Usuario.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
  });

module.exports = { obtenerPorCorreoConPassword, obtenerPorId };
