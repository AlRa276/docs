const valRepo           = require('../repositories/valoracionRepository');
const { crearError } = require('../middlewares/errorHandler');
const recetasRepo    = require('../repositories/recetaRepository');


const listarDeReceta = (id_receta) => valRepo.obtenerDeReceta(id_receta);

const guardar = async (id_receta, { id_usuario, puntuacion, comentario }) => {
    const receta = await recetasRepo.obtenerPorId(id_receta);
    if (!receta) throw crearError(404, 'Receta no encontrada');
    // Sequelize valida min:1 max:5 del model Valoracion automáticamente
    await valRepo.crearOActualizar(id_usuario, id_receta, puntuacion, comentario);
};

const eliminar = async (id) => {
    const n = await valRepo.eliminar(id);
    if (!n) throw crearError(404, 'Valoración no encontrada');
};

module.exports = { listarDeReceta, guardar, eliminar };
