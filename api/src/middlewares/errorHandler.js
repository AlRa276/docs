const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * Crea un error con status HTTP personalizado.
 * Uso: throw crearError(404, 'Receta no encontrada')
 */
const crearError = (status, mensaje) => {
  const err = new Error(mensaje);
  err.status = status;
  return err;
};

/**
 * Middleware global de errores.
 * Captura errores de Sequelize y los convierte a respuestas JSON limpias.
 */
const errorMiddleware = (err, _req, res, _next) => {
  console.error(err);

  // Error de validación de Sequelize (campos inválidos según el model)
  if (err instanceof ValidationError) {
    return res.status(400).json({
      ok:      false,
      mensaje: 'Error de validación',
      errores: err.errors.map(e => e.message),
    });
  }

  // Error de campo único duplicado (correo, nombre de categoría, etc.)
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      ok:      false,
      mensaje: 'Ya existe un registro con ese valor',
      errores: err.errors.map(e => e.message),
    });
  }

  // Errores propios lanzados con crearError()
  res.status(err.status || 500).json({
    ok:      false,
    mensaje: err.message || 'Error interno del servidor',
  });
};

module.exports = { crearError, errorMiddleware };
