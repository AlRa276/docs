const comentariosService = require('../services/comentarioService');

const listar =   async (req, res, next) => { 
    try { res.json({ ok: true, comentarios: await comentariosService.listarDeReceta(Number(req.params.id_receta)) }); } catch (e) { next(e); } };
const crear =    async (req, res, next) => { 
    try { 
        const c = await comentariosService.crear(
            Number(req.params.id_receta), 
            { ...req.body,
                 id_usuario: req.usuario.id
             }
        ); 
        res.status(201).json({ 
            ok: true, id: c.id, mensaje: 'Comentario agregado' 
        }); } catch (e) { next(e); } };
const eliminar = async (req, res, next) => { try { await comentariosService.eliminar(Number(req.params.id)); res.json({ ok: true, mensaje: 'Comentario eliminado' }); } catch (e) { next(e); } };

const listarTodos = async (req, res, next) => {
    try {
        res.json({ ok: true, comentarios: await comentariosService.listarTodos() });
    } catch (e) { next(e); }
};
module.exports = { listar, crear, eliminar, listarTodos };
