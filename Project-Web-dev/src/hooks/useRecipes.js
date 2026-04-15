import { useState, useEffect } from 'react';
import { getRecetas } from '../api/recetas';

const useRecipes = (filtros = {}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecipes = async () => {
            setLoading(true);
            try {
                const data = await getRecetas(filtros);
                setRecipes(data.recetas);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        loadRecipes();
    }, [JSON.stringify(filtros)]); // re-ejecuta cuando cambian los filtros

    return { recipes, loading, error };
};

export default useRecipes;