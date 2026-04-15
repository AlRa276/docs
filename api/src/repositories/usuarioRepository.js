const { Usuario } = require('../models');

const obtenerTodos = async () =>
  Usuario.findAll({
    attributes: { exclude: ['biografia'] },
    order: [['fecha_creacion', 'DESC']],
  });

const obtenerPorId = async (id) =>
  Usuario.findByPk(id, {
    attributes: { exclude: [] },
  });

const obtenerPorCorreo = async (correo) =>
  Usuario.findOne({ where: { correo_electronico: correo } });

const crear = async (datos) =>
  Usuario.create(datos);

const actualizar = async (id, datos) =>
  Usuario.update(datos, { where: { id } });

const eliminar = async (id) =>
  Usuario.destroy({ where: { id } });

module.exports = { obtenerTodos, obtenerPorId, obtenerPorCorreo, crear, actualizar, eliminar };
