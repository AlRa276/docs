const favoritosService = require('../services/favoritoService');

const listar =   async (req, res, next) => { try { res.json({ ok: true, favoritos: await favoritosService.listarDeUsuario(Number(req.params.id_usuario)) }); } catch (e) { next(e); } };
const agregar = async (req, res, next) => { 
    try { 
        await favoritosService.agregar(
            Number(req.usuario.id),          // 👈 del token, no del body
            Number(req.params.id_receta)
        ); 
        res.status(201).json({ ok: true, mensaje: 'Agregado a favoritos' }); 
    } catch (e) { next(e); } 
};

const eliminar = async (req, res, next) => { 
    try { 
        await favoritosService.eliminar(
            Number(req.usuario.id),          // 👈 del token, no del body
            Number(req.params.id_receta)
        ); 
        res.json({ ok: true, mensaje: 'Eliminado de favoritos' }); 
    } catch (e) { next(e); } 
};const estado =   async (req, res, next) => { try { const es = await favoritosService.estado(Number(req.query.id_usuario), Number(req.params.id_receta)); res.json({ ok: true, es_favorito: es }); } catch (e) { next(e); } };


module.exports = { listar, agregar, eliminar, estado };
