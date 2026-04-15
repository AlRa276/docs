// Importar todos los modelos
const sequelize            = require('../config/db');
const Categoria            = require('./Categoria');
const Usuario              = require('./Usuario');
const Receta               = require('./Receta');
const Ingrediente          = require('./Ingrediente');
const Paso                 = require('./Paso');
const Favorito             = require('./Favorito');
const Valoracion           = require('./Valoracion');
const Comentario           = require('./Comentario');
const ConfiguracionUsuario = require('./ConfiguracionUsuario');
const ConfiguracionGlobal  = require('./ConfiguracionGlobal');

// ── Asociaciones ───────────────────────────────────────────────────────────

// Usuario → Receta (un usuario crea muchas recetas)
Usuario.hasMany(Receta,   { foreignKey: 'id_creador', as: 'recetas', onDelete: 'CASCADE' });
Receta.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });

// Categoria → Receta (una categoría tiene muchas recetas)
Categoria.hasMany(Receta,   { foreignKey: 'id_categoria', as: 'recetas', onDelete: 'SET NULL' });
Receta.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

// Receta → Ingrediente (una receta tiene muchos ingredientes)
Receta.hasMany(Ingrediente,     { foreignKey: 'id_receta', as: 'ingredientes', onDelete: 'CASCADE' });
Ingrediente.belongsTo(Receta,   { foreignKey: 'id_receta' });

// Receta → Paso (una receta tiene muchos pasos)
Receta.hasMany(Paso,   { foreignKey: 'id_receta', as: 'pasos', onDelete: 'CASCADE' });
Paso.belongsTo(Receta, { foreignKey: 'id_receta' });

// Usuario ↔ Receta (favoritos, relación many-to-many)
Usuario.belongsToMany(Receta,  { through: Favorito, foreignKey: 'id_usuario', otherKey: 'id_receta', as: 'recetasFavoritas' });
Receta.belongsToMany(Usuario,  { through: Favorito, foreignKey: 'id_receta',  otherKey: 'id_usuario', as: 'usuariosQueFavorecen' });

// Usuario → Valoracion
Usuario.hasMany(Valoracion,    { foreignKey: 'id_usuario', as: 'valoraciones', onDelete: 'CASCADE' });
Valoracion.belongsTo(Usuario,  { foreignKey: 'id_usuario', as: 'usuario' });

// Receta → Valoracion
Receta.hasMany(Valoracion,    { foreignKey: 'id_receta', as: 'valoraciones', onDelete: 'CASCADE' });
Valoracion.belongsTo(Receta,  { foreignKey: 'id_receta' });

// Usuario → Comentario
Usuario.hasMany(Comentario,   { foreignKey: 'id_usuario', as: 'comentarios', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Receta → Comentario
Receta.hasMany(Comentario,    { foreignKey: 'id_receta', as: 'comentarios', onDelete: 'CASCADE' });
Comentario.belongsTo(Receta,  { foreignKey: 'id_receta' });

// Comentario → Comentario (respuestas/hilos)
Comentario.hasMany(Comentario,    { foreignKey: 'id_respuesta_a', as: 'respuestas', onDelete: 'CASCADE' });
Comentario.belongsTo(Comentario,  { foreignKey: 'id_respuesta_a', as: 'respuestaA' });

// Usuario → ConfiguracionUsuario (uno a uno)
Usuario.hasOne(ConfiguracionUsuario,    { foreignKey: 'id_usuario', as: 'configuracion', onDelete: 'CASCADE' });
ConfiguracionUsuario.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// ── Exportar todo desde un solo lugar ─────────────────────────────────────
module.exports = {
  sequelize,
  Categoria,
  Usuario,
  Receta,
  Ingrediente,
  Paso,
  Favorito,
  Valoracion,
  Comentario,
  ConfiguracionUsuario,
  ConfiguracionGlobal,
};
