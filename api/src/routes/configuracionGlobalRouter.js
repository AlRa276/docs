const router = require('express').Router();
const config = require('../controllers/configuracionGlobalController');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/',  config.obtener);                              // público — el frontend lo necesita para mostrar el hero
router.put('/',  verificarToken, soloAdmin, config.actualizar); // solo admin

module.exports = router;