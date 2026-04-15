const repo           = require('../repositories/recetaRepository');
const { sequelize }  = require('../models');
const { crearError } = require('../middlewares/errorHandler');

const listar           = (filtros) => repo.obtenerTodas(filtros);
const listarDestacadas = ()        => repo.obtenerDestacadas();

const obtener = async (id) => {
  const receta = await repo.obtenerPorId(id);
  if (!receta) throw crearError(404, 'Receta no encontrada');
  return receta;
};

const crear = async ({ receta, ingredientes = [], pasos = [] }) => {
  if (!ingredientes.length) throw crearError(400, 'Debe incluir al menos un ingrediente');
  if (!pasos.length)        throw crearError(400, 'Debe incluir al menos un paso');

  // Si el front mandó un tiempo_total directo, lo repartimos en prep
  // Si no, lo calculamos sumando los temporizadores de los pasos (en segundos → minutos)
  if (!receta.tiempo_prep_minutos && !receta.tiempo_coccion_minutos) {
    const totalSegundos = pasos.reduce((sum, p) => sum + (p.duracion_segundos || 0), 0);
    receta.tiempo_prep_minutos     = Math.ceil(totalSegundos / 60) || 1;
    receta.tiempo_coccion_minutos  = 0;
  }

  const t = await sequelize.transaction();
  try {
    const id = await repo.crear({ receta, ingredientes, pasos }, t);
    await t.commit();
    return repo.obtenerPorId(id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Actualización parcial — el front puede mandar cualquier combinación:
 *
 * Solo datos de la receta:
 *   { receta: { titulo: "Nuevo título" } }
 *
 * Solo ingredientes (reemplaza todos):
 *   { ingredientes: [ { nombre, cantidad, unidad }, ... ] }
 *
 * Solo pasos (reemplaza todos):
 *   { pasos: [ { instruccion, duracion_minutos }, ... ] }
 *
 * Todo junto:
 *   { receta: { ... }, ingredientes: [ ... ], pasos: [ ... ] }
 */
const actualizar = async (id, datos) => {
  const receta = await repo.obtenerPorId(id);
  if (!receta) throw crearError(404, 'Receta no encontrada');

  // Validar que si vienen ingredientes/pasos no lleguen vacíos
  if (datos.ingredientes !== undefined && datos.ingredientes.length === 0)
    throw crearError(400, 'La receta debe tener al menos un ingrediente');
  if (datos.pasos !== undefined && datos.pasos.length === 0)
    throw crearError(400, 'La receta debe tener al menos un paso');

  await repo.actualizar(id, datos);
  return repo.obtenerPorId(id);
};

const eliminar = async (id) => {
  const receta = await repo.obtenerPorId(id);
  if (!receta) throw crearError(404, 'Receta no encontrada');
  await repo.eliminar(id);
};

module.exports = { listar, listarDestacadas, obtener, crear, actualizar, eliminar };
