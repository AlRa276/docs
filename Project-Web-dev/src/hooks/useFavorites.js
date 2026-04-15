import { useState, useEffect, useCallback } from 'react';
import { getFavoritos, agregarFavorito, eliminarFavorito } from '../api/favoritos';

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    // Obtener id del usuario del token
    const token = localStorage.getItem('token');
    const currentUserId = token 
        ? JSON.parse(atob(token.split('.')[1]))?.id 
        : null;

    // Cargar favoritos del backend si hay sesión, si no usar localStorage
    useEffect(() => {
        if (currentUserId) {
            const fetchFavoritos = async () => {
                try {
                    setLoading(true);
                    const data = await getFavoritos(currentUserId);
                    const ids = (data.favoritos || []).map(f => String(f.id));
                    setFavorites(ids);
                } catch (err) {
                    console.error('Error cargando favoritos:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavoritos();
        } else {
            // Sin sesión — usar localStorage
            const saved = localStorage.getItem('namNamFavorites');
            setFavorites(saved ? JSON.parse(saved) : []);
        }
    }, [currentUserId]);

    // Sincronizar localStorage cuando no hay sesión
    useEffect(() => {
        if (!currentUserId) {
            localStorage.setItem('namNamFavorites', JSON.stringify(favorites));
        }
    }, [favorites, currentUserId]);

    const toggleFavorite = useCallback(async (id) => {
        console.log('toggleFavorite id:', id, typeof id);
        if (!id || isNaN(Number(id))) {
        console.error('toggleFavorite: id inválido:', id);
        return;
    }
        const strId = String(id);
        const esFavorito = favorites.includes(strId);

        // Actualización optimista — cambia el estado inmediatamente
        setFavorites(prev =>
            esFavorito ? prev.filter(fid => fid !== strId) : [...prev, strId]
        );

        if (currentUserId) {
            try {
                if (esFavorito) {
                    await eliminarFavorito(id);
                } else {
                    await agregarFavorito(id);
                }
            } catch (err) {
                console.error('Error actualizando favorito:', err);
                // Revertir si falla
                setFavorites(prev =>
                    esFavorito ? [...prev, strId] : prev.filter(fid => fid !== strId)
                );
            }
        }
    }, [favorites, currentUserId]);

    const isFavorite = useCallback((id) => favorites.includes(String(id)), [favorites]);

    return { favorites, toggleFavorite, isFavorite, loading };
};

export default useFavorites;