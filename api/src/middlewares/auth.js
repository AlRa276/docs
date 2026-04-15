const jwt            = require('jsonwebtoken');
const { crearError } = require('./errorHandler');

/**
 * Middleware que verifica que el request tenga un JWT válido.
 * Uso: router.post('/ruta', verificarToken, controller)
 *
 * Espera el header:  Authorization: Bearer <token>
 * Si es válido, adjunta el payload en req.usuario para usarlo en controllers/services.
 */
const verificarToken = (req, _res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader)               return next(crearError(401, 'Token no proporcionado'));
  if (!authHeader.startsWith('Bearer ')) return next(crearError(401, 'Formato de token inválido. Usa: Bearer <token>'));

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario   = payload; // { id, correo, rol, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')  return next(crearError(401, 'El token ha expirado'));
    if (err.name === 'JsonWebTokenError') return next(crearError(401, 'Token inválido'));
    next(crearError(401, 'Error al verificar el token'));
  }
};

/**
 * Middleware que verifica que el usuario autenticado sea admin.
 * Siempre debe usarse DESPUÉS de verificarToken.
 * Uso: router.delete('/ruta', verificarToken, soloAdmin, controller)
 */
const soloAdmin = (req, _res, next) => {
  if (req.usuario?.rol !== 'admin') return next(crearError(403, 'Acceso restringido a administradores'));
  next();
};

module.exports = { verificarToken, soloAdmin };
