const catRepo           = require('../repositories/categoriaRepository');
const { crearError } = require('../middlewares/errorHandler');


const listar =  () => catRepo.obtenerTodas();

const obtener = async (id) => {
    const cat = await catRepo.obtenerPorId(id);
    if (!cat) throw crearError(404, 'Categoría no encontrada');
    return cat;
  };

const crear = (datos) => catRepo.crear(datos);

const actualizar = async (id, datos) => {
    const [n] = await catRepo.actualizar(id, datos);
    if (!n) throw crearError(404, 'Categoría no encontrada');
    return catRepo.obtenerPorId(id);
  };

const eliminar = async (id) => {
    const n = await catRepo.eliminar(id);
    if (!n) throw crearError(404, 'Categoría no encontrada');
  };
  

module.exports = { listar, obtener, crear, actualizar, eliminar };
