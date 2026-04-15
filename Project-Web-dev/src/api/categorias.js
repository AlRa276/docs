import { fetchConToken, fetchSinToken } from './config';

export const getCategorias = () =>
  fetchSinToken('/api/categorias');

export const getCategoria = (id) =>
  fetchSinToken(`/api/categorias/${id}`);

// Solo admin
export const crearCategoria = (datos) =>
  fetchConToken('/api/categorias', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

export const actualizarCategoria = (id, datos) =>
  fetchConToken(`/api/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

export const eliminarCategoria = (id) =>
  fetchConToken(`/api/categorias/${id}`, { method: 'DELETE' });