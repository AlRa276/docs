const repo           = require('../repositories/usuarioRepository');
const { crearError } = require('../middlewares/errorHandler');

const listar  = ()     => repo.obtenerTodos();
const obtener = async (id) => {
  const u = await repo.obtenerPorId(id);
  if (!u) throw crearError(404, 'Usuario no encontrado');
  return u;
};

const crear = async (datos) => {
  if (datos.correo_electronico) {
    const existe = await repo.obtenerPorCorreo(datos.correo_electronico);
    if (existe) throw crearError(409, 'El correo ya está registrado');
  }
  // Sequelize valida los campos del model (isEmail, notEmpty, len...)
  const u = await repo.crear(datos);
  return repo.obtenerPorId(u.id);
};

const actualizar = async (id, datos) => {
  const u = await repo.obtenerPorId(id);
  if (!u) throw crearError(404, 'Usuario no encontrado');
  await repo.actualizar(id, datos);
  return repo.obtenerPorId(id);
};

const eliminar = async (id) => {
  const u = await repo.obtenerPorId(id);
  if (!u) throw crearError(404, 'Usuario no encontrado');
  await repo.eliminar(id);
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
