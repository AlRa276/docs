const favRepo = require('../repositories/favoritoRepository');
const recetasRepo = require('../repositories/recetaRepository');
const { crearError } = require('../middlewares/errorHandler');


const listarDeUsuario = (id_usuario) => favRepo.obtenerDeUsuario(id_usuario);

const agregar = async (id_usuario, id_receta) => {
    const receta = await recetasRepo.obtenerPorId(id_receta);
    if (!receta) throw crearError(404, 'Receta no encontrada');
    await favRepo.agregar(id_usuario, id_receta);
};

const eliminar = async (id_usuario, id_receta) => {
    const n = await favRepo.eliminar(id_usuario, id_receta);
    if (!n) throw crearError(404, 'Favorito no encontrado');
};

const estado = (id_usuario, id_receta) => favRepo.existe(id_usuario, id_receta);

module.exports = { listarDeUsuario, agregar, eliminar, estado };