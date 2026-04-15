import { fetchConToken} from './config';

export const getPerfil = async () => {
  const data = await fetchConToken('/api/auth/perfil');
  return data.usuario;
};


export const actualizarPerfil = (id, datos) =>
    fetchConToken(`/api/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    });

export const eliminarUsuario = (id) =>
    fetchConToken(`/api/usuarios/${id}`, { method: 'DELETE' });

