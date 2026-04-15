const service = require('../services/configuracionGlobalService');

const obtener = async (req, res, next) => {
  try {
    const config = await service.obtener();
    res.json({ ok: true, config });
  } catch (e) { next(e); }
};

const actualizar = async (req, res, next) => {
  try {
    const config = await service.actualizar(req.body);
    res.json({ ok: true, config });
  } catch (e) { next(e); }
};

module.exports = { obtener, actualizar };