const router          = require('express').Router();
const auth           = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/registro', auth.registrar);
router.post('/login',    auth.login);
router.post('/logout',   verificarToken, auth.logout);

// Ruta protegida — requiere token válido
router.get('/perfil', verificarToken, auth.perfil);

router.post('/google', auth.loginConGoogle);

module.exports = router;
