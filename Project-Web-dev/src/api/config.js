export const API_URL = import.meta.env.VITE_API_URL;

export const getToken = () => localStorage.getItem('token');

export const fetchConToken = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    return;
  }

  const data = await res.json(); 
  
  console.log('fetchConToken response:', res.status, data); 
  if (!res.ok) throw new Error(data.mensaje || 'Error en la petición');
  return data;
};

export const fetchSinToken = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error en la petición');
  return data;
};