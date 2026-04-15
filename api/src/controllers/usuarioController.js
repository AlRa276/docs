const usuariosService = require('../services/usuarioService');

const listar =     async (req, res, next) => { try { res.json({ ok: true, usuarios: await usuariosService.listar() }); } catch (e) { next(e); } };
const obtener =    async (req, res, next) => { try { res.json({ ok: true, usuario: await usuariosService.obtener(Number(req.params.id)) }); } catch (e) { next(e); } };
const crear =      async (req, res, next) => { try { res.status(201).json({ ok: true, usuario: await usuariosService.crear(req.body) }); } catch (e) { next(e); } };
const actualizar = async (req, res, next) => { try { res.json({ ok: true, usuario: await usuariosService.actualizar(Number(req.params.id), req.body) }); } catch (e) { next(e); } };
const eliminar =   async (req, res, next) => { try { await usuariosService.eliminar(Number(req.params.id)); res.json({ ok: true, mensaje: 'Usuario eliminado' }); } catch (e) { next(e); } };


module.exports = { listar, obtener, crear, actualizar, eliminar };
