const router = require('express').Router();
const receta   = require('../controllers/recetaController');
 
const { verificarToken, soloAdmin } = require('../middlewares/auth');
const { route } = require('./usuarioRouter');

// ── Rutas públicas ─────────────────────────────────────────────────────
router.get('/',           receta.listar);
router.get('/destacadas', receta.listarDestacadas);
router.get('/:id',        receta.obtener);
router.get('/categoria/:id_categoria', receta.listar);

// ── Rutas protegidas (requieren login) ────────────────────────────────
router.post('/',      verificarToken, soloAdmin,           receta.crear);
router.put('/:id',    verificarToken, soloAdmin,           receta.actualizar);
router.delete('/:id', verificarToken, soloAdmin,           receta.eliminar);
 
module.exports = router;