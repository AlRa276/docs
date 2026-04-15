const comRepo           = require('../repositories/comentarioRepository');
const recetasRepo       = require('../repositories/recetaRepository');
const { crearError } = require('../middlewares/errorHandler');

const listarDeReceta = (id_receta) => comRepo.obtenerDeReceta(id_receta);

const crear = async (id_receta, { id_usuario, texto, id_respuesta_a }) => {
    const receta = await recetasRepo.obtenerPorId(id_receta);
    if (!receta) throw crearError(404, 'Receta no encontrada');
    // Sequelize valida notEmpty del model Comentario automáticamente
    return comRepo.crear({ id_usuario, id_receta, texto, id_respuesta_a: id_respuesta_a || null });
};

const eliminar = async (id) => {
    const n = await comRepo.eliminar(id);
    if (!n) throw crearError(404, 'Comentario no encontrado');
};

const listarTodos = () => comRepo.obtenerTodos();

module.exports = { listarDeReceta, crear, eliminar, listarTodos };
