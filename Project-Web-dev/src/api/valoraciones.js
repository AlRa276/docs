import { fetchConToken, fetchSinToken } from './config';

export const getValoraciones = (id_receta) =>
  fetchSinToken(`/api/valoraciones/receta/${id_receta}`);

export const guardarValoracion = (id_receta, datos) =>
  fetchConToken(`/api/valoraciones/receta/${id_receta}`, {
    method: 'POST',
    body: JSON.stringify(datos),
  });

export const eliminarValoracion = (id) =>
  fetchConToken(`/api/valoraciones/${id}`, { method: 'DELETE' });