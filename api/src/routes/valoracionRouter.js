const router = require('express').Router();
const  valoraciones = require('../controllers/valoracionController');

const { verificarToken } = require('../middlewares/auth');

router.get('/receta/:id_receta',  valoraciones.listar);
router.post('/receta/:id_receta', verificarToken, valoraciones.guardar);
router.delete('/:id',             verificarToken, valoraciones.eliminar);

module.exports = router;