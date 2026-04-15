const router = require('express').Router();
const  categorias = require('../controllers/categoriaController');


const { verificarToken, soloAdmin } = require('../middlewares/auth');

// ── Públicas ──────────────────────────────────────────────────────────
router.get('/',    categorias.listar);
router.get('/:id', categorias.obtener);

// ── Solo admin ────────────────────────────────────────────────────────
router.post('/',      verificarToken, soloAdmin, categorias.crear);
router.put('/:id',    verificarToken, soloAdmin, categorias.actualizar);
router.delete('/:id', verificarToken, soloAdmin, categorias.eliminar);


module.exports = router;