import { fetchConToken, fetchSinToken } from './config';

export const getComentarios = (id_receta) =>
  fetchSinToken(`/api/comentarios/receta/${id_receta}`);

export const crearComentario = (id_receta, datos) =>
  fetchConToken(`/api/comentarios/receta/${id_receta}`, {
    method: 'POST',
    body: JSON.stringify(datos),
  });

export const eliminarComentario = (id) =>
  fetchConToken(`/api/comentarios/${id}`, { method: 'DELETE' });

export const getTodosComentarios = () =>
  fetchConToken('/api/comentarios');