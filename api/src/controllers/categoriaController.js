const categoriasService = require('../services/categoriaService');

const listar    = async (req, res, next) => { try { res.json({ ok: true, categorias: await categoriasService.listar() }); } catch (e) { next(e); } };
const obtener =   async (req, res, next) => { try { res.json({ ok: true, categoria: await categoriasService.obtener(Number(req.params.id)) }); } catch (e) { next(e); } };
const crear =    async (req, res, next) => { try { res.status(201).json({ ok: true, categoria: await categoriasService.crear(req.body) }); } catch (e) { next(e); } };
const actualizar = async (req, res, next) => { try { res.json({ ok: true, categoria: await categoriasService.actualizar(Number(req.params.id), req.body) }); } catch (e) { next(e); } };
const eliminar =   async (req, res, next) => { try { await categoriasService.eliminar(Number(req.params.id)); res.json({ ok: true, mensaje: 'Categoría eliminada' }); } catch (e) { next(e); } };


module.exports = { listar, obtener, crear, actualizar, eliminar };
