const router = require('express').Router();
const  usuarios = require('../controllers/usuarioController');

const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/',       verificarToken, soloAdmin, usuarios.listar);
router.get('/:id',    verificarToken,            usuarios.obtener);
router.post('/',       usuarios.crear);
router.put('/:id',    verificarToken,            usuarios.actualizar);
router.delete('/:id', verificarToken, usuarios.eliminar);

module.exports = router;