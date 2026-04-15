const { Favorito, Receta, Usuario } = require('../models');

const obtenerDeUsuario = (id_usuario) =>
  Usuario.findByPk(id_usuario, {
    include: [{
      model:      Receta,
      as:         'recetasFavoritas',
      attributes: ['id', 'titulo', 'url_imagen', 'tiempo_prep_minutos',
        'tiempo_coccion_minutos', // 👈 agregar
        'dificultad',             // 👈 agregar
        'porciones',              // 👈 agregar
        'descripcion'           // 👈 agregar
      
      ],
      through:    { attributes: ['fecha_guardado'] },
    }],
  }).then(u => u ? u.recetasFavoritas : []);

const agregar = (id_usuario, id_receta) =>
  Favorito.findOrCreate({ where: { id_usuario, id_receta } });

const eliminar = (id_usuario, id_receta) =>
  Favorito.destroy({ where: { id_usuario, id_receta } });

const existe = async (id_usuario, id_receta) => {
  const fav = await Favorito.findOne({ where: { id_usuario, id_receta } });
  return !!fav;
};

module.exports = { obtenerDeUsuario, agregar, eliminar, existe };