const valoracionesService = require('../services/valoracionService');

const listar =   async (req, res, next) => { try { res.json({ ok: true, valoraciones: await valoracionesService.listarDeReceta(Number(req.params.id_receta)) }); } catch (e) { next(e); } };
const guardar = async (req, res, next) => { 
    try { 
        await valoracionesService.guardar(
            Number(req.params.id_receta), 
            {
                ...req.body,
                id_usuario: req.usuario.id  // 👈 del token
            }
        ); 
        res.json({ ok: true, mensaje: 'Valoración guardada' }); 
    } catch (e) { next(e); } 
};const eliminar = async (req, res, next) => { try { await valoracionesService.eliminar(Number(req.params.id)); res.json({ ok: true, mensaje: 'Valoración eliminada' }); } catch (e) { next(e); } };


module.exports = { listar, guardar, eliminar };
