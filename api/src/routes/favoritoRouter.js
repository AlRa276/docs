// favoritos.routes.js
const router = require('express').Router();
const favoritos  = require('../controllers/favoritoController');
const { verificarToken } = require('../middlewares/auth');

router.get('/usuario/:id_usuario',      favoritos.listar);
router.get('/receta/:id_receta/estado', favoritos.estado);   // ?id_usuario=X

router.post('/receta/:id_receta',   verificarToken, favoritos.agregar);
router.delete('/receta/:id_receta', verificarToken, favoritos.eliminar);

module.exports = router;