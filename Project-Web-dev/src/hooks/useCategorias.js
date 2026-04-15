import { useState, useEffect } from 'react';
import { getCategorias } from '../api/categorias';

const useCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCategorias();
                setCategorias(data.categorias);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return { categorias, loading };
};

export default useCategorias;