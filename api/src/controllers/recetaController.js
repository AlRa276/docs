const service = require('../services/recetaService');

const listar = async (req, res, next) => {
  try {
    const filtros = { ...req.query, ...req.params };
    const resultado = await service.listar(filtros);
    res.json({ ok: true, ...resultado });
  } catch (err) { next(err); }
};

const listarDestacadas = async (req, res, next) => {
  try {
    const recetas = await service.listarDestacadas();
    res.json({ ok: true, recetas });
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const receta = await service.obtener(Number(req.params.id));
    res.json({ ok: true, receta });
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    // req.usuario viene del middleware verificarToken
    const datos = {
      ...req.body,
      receta: {
        ...req.body.receta,
        id_creador: req.usuario.id, // 👈 toma el id del token
      }
    };
    const receta = await service.crear(datos);
    res.status(201).json({ ok: true, receta });
  } catch (err) { next(err); }
};
// El body puede tener { receta, ingredientes, pasos } en cualquier combinación
const actualizar = async (req, res, next) => {
  try {
    const receta = await service.actualizar(Number(req.params.id), req.body);
    res.json({ ok: true, receta });
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    await service.eliminar(Number(req.params.id));
    res.json({ ok: true, mensaje: 'Receta eliminada' });
  } catch (err) { next(err); }
};

module.exports = { listar, listarDestacadas, obtener, crear, actualizar, eliminar };
