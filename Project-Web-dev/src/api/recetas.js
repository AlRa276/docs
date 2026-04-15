import { API_URL, fetchConToken, fetchSinToken } from './config';

export const mapReceta = (recipe) => ({
    id: recipe.id,
    title: recipe.titulo,
    image: recipe.url_imagen,
    time: `${recipe.tiempo_prep_minutos + recipe.tiempo_coccion_minutos} min`,
    difficulty: recipe.dificultad,
    rating: recipe.puntuacion_promedio || 0,
    servings: recipe.porciones,
     description: recipe.descripcion,        
    category: recipe.categoria?.nombre || '',
    es_destacada: recipe.es_destacada,
});

export const getRecetas = async (filtros = {}) => {
    const token = localStorage.getItem("token");
    const query = new URLSearchParams(filtros).toString();

    const res = await fetch(`${API_URL}/api/recetas${query ? `?${query}` : ''}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error al obtener recetas");
    const data = await res.json();
    return {
        ...data,
        recetas: data.recetas.map(mapReceta)
        
    };
    
};

export const getRecetasDestacadas = () =>
  fetchSinToken('/api/recetas/destacadas');

export const getReceta = (id) =>
  fetchSinToken(`/api/recetas/${id}`);

export const getRecetasPorCategoria = (id_categoria, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchSinToken(`/api/recetas/categoria/${id_categoria}${query ? `?${query}` : ''}`);
};

// Solo admin
export const crearReceta = (datos) =>
  fetchConToken('/api/recetas', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

export const actualizarReceta = (id, datos) =>
  fetchConToken(`/api/recetas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });

export const eliminarReceta = (id) =>
  fetchConToken(`/api/recetas/${id}`, { method: 'DELETE' });
