const repo           = require('../repositories/configuracionGlobalRepository');
const { crearError } = require('../middlewares/errorHandler');

const CLAVES_PERMITIDAS = ['title', 'subtitle', 'tagline'];

const obtener = async () => {
  const configs = await repo.obtenerTodas();
  // Devuelve un objeto plano { title: '...', subtitle: '...', tagline: '...' }
  return configs.reduce((acc, c) => {
    acc[c.clave] = c.valor;
    return acc;
  }, {});
};

const actualizar = async (datos) => {
  const claves = Object.keys(datos);
  const invalidas = claves.filter(k => !CLAVES_PERMITIDAS.includes(k));
  if (invalidas.length) {
    throw crearError(400, `Claves no permitidas: ${invalidas.join(', ')}`);
  }

  await Promise.all(
    claves.map(clave => repo.upsert(clave, datos[clave]))
  );

  return obtener();
};

module.exports = { obtener, actualizar };