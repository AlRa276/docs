const { Categoria } = require('../models');


const obtenerTodas =  ()   => Categoria.findAll({ order: [['nombre', 'ASC']] });
const obtenerPorId =  (id) => Categoria.findByPk(id);
const crear =       (datos) => Categoria.create(datos);
const actualizar =  (id, datos) => Categoria.update(datos, { where: { id } });
const eliminar =    (id) => Categoria.destroy({ where: { id } }); 
  
module.exports = { obtenerTodas, obtenerPorId, crear, actualizar, eliminar };