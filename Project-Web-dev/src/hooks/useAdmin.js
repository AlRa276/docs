import { useState, useEffect } from 'react';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Decodificar el payload del JWT sin librería
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Verificar que no esté expirado
      const ahora = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < ahora) {
        localStorage.removeItem('token');
        setIsAdmin(false);
      } else {
        setIsAdmin(payload.rol === 'admin');
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { isAdmin, loading };
};

export default useAdmin;