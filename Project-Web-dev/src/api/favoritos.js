import { fetchConToken, fetchSinToken } from './config';

export const getFavoritos = (id_usuario) =>
  fetchSinToken(`/api/favoritos/usuario/${id_usuario}`);

export const getEstadoFavorito = (id_receta, id_usuario) =>
  fetchSinToken(`/api/favoritos/receta/${id_receta}/estado?id_usuario=${id_usuario}`);

export const agregarFavorito = (id_receta) =>
  fetchConToken(`/api/favoritos/receta/${id_receta}`, { method: 'POST' });

export const eliminarFavorito = (id_receta) =>
  fetchConToken(`/api/favoritos/receta/${id_receta}`, { method: 'DELETE' });