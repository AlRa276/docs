
const { Valoracion, Usuario } = require('../models');
const obtenerDeReceta = (id_receta) =>
    Valoracion.findAll({
      where:   { id_receta },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre_mostrar', 'url_foto'] }],
      order:   [['fecha_creacion', 'DESC']],
    });

const crearOActualizar = (id_usuario, id_receta, puntuacion, comentario) =>
  Valoracion.upsert({ id_usuario, id_receta, puntuacion, comentario });

const eliminar = (id) => Valoracion.destroy({ where: { id } });

module.exports = { obtenerDeReceta, crearOActualizar, eliminar };