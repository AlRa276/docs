const { Op, fn, col } = require('sequelize');
const { Receta, Usuario, Categoria, Ingrediente, Paso, Valoracion, sequelize } = require('../models');

const includeBase = [
  { model: Usuario,   as: 'creador',   attributes: ['id', 'nombre_mostrar', 'url_foto'] },
  { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
];

// src/repositories/recetaRepository.js
const obtenerTodas = async ({
  pagina       = 1,
  limite       = 12,
  id_categoria,
  busqueda,
  tiempo_max,        
  porciones_min,     
  porciones_max,     
  ingrediente,       
} = {}) => {
  const where = {};
  if (id_categoria) where.id_categoria = id_categoria;
  if (busqueda)     where.titulo = { [Op.like]: `%${busqueda}%` };

  // Filtro de tiempo total (prep + cocción)
  if (tiempo_max) {
    where[Op.and] = where[Op.and] || [];
    where[Op.and].push(
      sequelize.where(
        sequelize.literal('(tiempo_prep_minutos + tiempo_coccion_minutos)'),
        { [Op.lte]: Number(tiempo_max) }
      )
    );
  }

  // Filtro de porciones
  if (porciones_min) where.porciones = { ...where.porciones, [Op.gte]: Number(porciones_min) };
  if (porciones_max) where.porciones = { ...where.porciones, [Op.lte]: Number(porciones_max) };

  // Filtro por ingrediente (required: true para que actúe como INNER JOIN)
  const includeIngrediente = ingrediente
    ? [{
        model:    Ingrediente,
        as:       'ingredientes',
        attributes: [],
        where:    { nombre: { [Op.like]: `%${ingrediente}%` } },
        required: true,
      }]
    : [];

  const { rows: recetas, count: total } = await Receta.findAndCountAll({
    where,
    include: [
      ...includeBase,
      { model: Valoracion, as: 'valoraciones', attributes: [] },
      ...includeIngrediente,
    ],
    attributes: {
      include: [
        [fn('ROUND', fn('AVG', col('valoraciones.puntuacion')), 1), 'puntuacion_promedio'],
        [fn('COUNT', col('valoraciones.id')), 'total_valoraciones'],
      ],
    },
    group:    ['Receta.id', 'creador.id', 'categoria.id'],
    order:    [['fecha_creacion', 'DESC']],
    limit:    Number(limite),
    offset:   (Number(pagina) - 1) * Number(limite),
    subQuery: false,
    distinct: true,
  });

  return { recetas, total, pagina: Number(pagina), limite: Number(limite) };
};

const obtenerDestacadas = async () =>
  Receta.findAll({
    where:   { es_destacada: true },
    include: [
      { model: Usuario,    as: 'creador',      attributes: ['id', 'nombre_mostrar'] },
      { model: Valoracion, as: 'valoraciones', attributes: [] },
    ],
    attributes: {
      include: [
        [fn('ROUND', fn('AVG', col('valoraciones.puntuacion')), 1), 'puntuacion_promedio'],
      ],
    },
    group:    ['Receta.id', 'creador.id'],
    order:    [['fecha_creacion', 'DESC']],
    limit:    10,
    subQuery: false,
  });

const obtenerPorId = async (id) =>
  Receta.findByPk(id, {
    include: [
      ...includeBase,
      { model: Ingrediente, as: 'ingredientes', attributes: ['id', 'nombre', 'cantidad', 'unidad'] },
      { model: Paso,        as: 'pasos',        attributes: ['id', 'numero_paso', 'instruccion', 'duracion_segundos'], order: [['numero_paso', 'ASC']] },
      { model: Valoracion,  as: 'valoraciones', attributes: [] },
    ],
    attributes: {
      include: [
        [fn('ROUND', fn('AVG', col('valoraciones.puntuacion')), 1), 'puntuacion_promedio'],
        [fn('COUNT', col('valoraciones.id')), 'total_valoraciones'],
      ],
    },
    group: ['Receta.id', 'creador.id', 'categoria.id', 'ingredientes.id', 'pasos.id'],
  });

const crear = async ({ receta, ingredientes = [], pasos = [] }, transaction) => {
  const nueva = await Receta.create(receta, { transaction });

  if (ingredientes.length) {
    await Ingrediente.bulkCreate(
      ingredientes.map(i => ({ ...i, id_receta: nueva.id })),
      { transaction }
    );
  }
  if (pasos.length) {
    await Paso.bulkCreate(
      pasos.map((p, idx) => ({ ...p, id_receta: nueva.id, numero_paso: idx + 1 })),
      { transaction }
    );
  }

  return nueva.id;
};

/**
 * Actualización completa en una sola transacción:
 * 1. Actualiza los campos de la receta (solo los que llegaron)
 * 2. Si vienen ingredientes nuevos: borra los anteriores e inserta los nuevos
 * 3. Si vienen pasos nuevos: borra los anteriores e inserta los nuevos
 */
const actualizar = async (id, { receta, ingredientes, pasos }) => {
  const t = await sequelize.transaction();
  try {
    // Actualizar campos de la receta solo si hay datos
    if (receta && Object.keys(receta).length) {
      await Receta.update(receta, { where: { id }, transaction: t });
    }

    // Reemplazar ingredientes si el front los mandó
    if (ingredientes) {
      await Ingrediente.destroy({ where: { id_receta: id }, transaction: t });
      if (ingredientes.length) {
        await Ingrediente.bulkCreate(
          ingredientes.map(i => ({ ...i, id_receta: id })),
          { validate: true, transaction: t }
        );
      }
    }

    // Reemplazar pasos si el front los mandó
    if (pasos) {
      await Paso.destroy({ where: { id_receta: id }, transaction: t });
      if (pasos.length) {
        await Paso.bulkCreate(
          pasos.map((p, idx) => ({ ...p, id_receta: id, numero_paso: idx + 1 })),
          { validate: true, transaction: t }
        );
      }
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const eliminar = async (id) =>
  Receta.destroy({ where: { id } });

module.exports = { obtenerTodas, obtenerDestacadas, obtenerPorId, crear, actualizar, eliminar };
