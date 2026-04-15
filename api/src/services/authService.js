const jwt            = require('jsonwebtoken');
const repo           = require('../repositories/authRepository');
const usuariosRepo   = require('../repositories/usuarioRepository');
const { crearError } = require('../middlewares/errorHandler');

const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/**
 * Genera un JWT con los datos básicos del usuario.
 */
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, correo: usuario.correo_electronico, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

/**
 * Registro: crea el usuario y devuelve token.
 */
const registrar = async ({ nombre_mostrar, correo_electronico, password }) => {
  if (!correo_electronico) throw crearError(400, 'El correo es requerido para registrarse');
  if (!password)           throw crearError(400, 'La contraseña es requerida');
  if (password.length < 6) throw crearError(400, 'La contraseña debe tener al menos 6 caracteres');

  const existe = await usuariosRepo.obtenerPorCorreo(correo_electronico);
  if (existe) throw crearError(409, 'El correo ya está registrado');

  // password_hash recibe la contraseña plana — el hook beforeCreate del model la hashea
  const usuario = await usuariosRepo.crear({ nombre_mostrar, correo_electronico, password_hash: password });
  const token   = generarToken(usuario);

  return {
    token,
    usuario: {
      id:             usuario.id,
      nombre_mostrar: usuario.nombre_mostrar,
      correo:         usuario.correo_electronico,
      rol:            usuario.rol,
    },
  };
};

/**
 * Login: valida credenciales y devuelve token.
 */
const login = async ({ correo_electronico, password }) => {
  if (!correo_electronico || !password) throw crearError(400, 'Correo y contraseña son requeridos');

  const usuario = await repo.obtenerPorCorreoConPassword(correo_electronico);
  if (!usuario) throw crearError(401, 'Credenciales incorrectas');

  const passwordValida = await usuario.verificarPassword(password);
  if (!passwordValida)  throw crearError(401, 'Credenciales incorrectas');

  const token = generarToken(usuario);

  return {
    token,
    usuario: {
      id:             usuario.id,
      nombre_mostrar: usuario.nombre_mostrar,
      correo:         usuario.correo_electronico,
      rol:            usuario.rol,
      url_foto:       usuario.url_foto,
    },
  };
};

/**
 * Devuelve el perfil del usuario autenticado (usando el id del token).
 */
const perfil = (id) => repo.obtenerPorId(id);

module.exports = { registrar, login, perfil };
