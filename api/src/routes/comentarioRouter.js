const router = require('express').Router();
const  comentarios  = require('../controllers/comentarioController');

const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/receta/:id_receta',  comentarios.listar);
router.post('/receta/:id_receta', verificarToken, comentarios.crear);
router.delete('/:id',             verificarToken, comentarios.eliminar);
router.get('/', verificarToken, soloAdmin, comentarios.listarTodos);

module.exports = router;

