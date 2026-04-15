import { fetchConToken, fetchSinToken } from './config';

export const getConfiguracion = () =>
  fetchSinToken('/api/configuracion');

// Solo admin
export const actualizarConfiguracion = (datos) =>
  fetchConToken('/api/configuracion', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });