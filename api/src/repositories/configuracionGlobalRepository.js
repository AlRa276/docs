const { ConfiguracionGlobal } = require('../models');

const obtenerTodas = () => ConfiguracionGlobal.findAll();

const obtenerPorClave = (clave) => ConfiguracionGlobal.findByPk(clave);

const upsert = (clave, valor, descripcion) =>
  ConfiguracionGlobal.upsert({ clave, valor, descripcion });

module.exports = { obtenerTodas, obtenerPorClave, upsert };