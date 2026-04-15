import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeModal from '../components/recipes/RecipeModal';
import useFavorites from '../hooks/useFavorites';
import useCategorias from '../hooks/useCategorias';
import { getRecetas } from '../api/recetas';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState(null); // null = Todos
    const [maxTime, setMaxTime] = useState(null);
    const [selectedServing, setSelectedServing] = useState('Cualquiera');
    const [ingredientFilter, setIngredientFilter] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const [recipes, setRecipes] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const { isFavorite, toggleFavorite } = useFavorites();
    const { categorias } = useCategorias();

    // Actualizar searchTerm cuando cambia la URL
    useEffect(() => {
        setSearchTerm(initialQuery);
    }, [initialQuery]);

    // Construir filtros y llamar a la API
    useEffect(() => {
        const fetchRecetas = async () => {
            setLoading(true);
            try {
                const filtros = {};

                if (searchTerm.trim())   filtros.busqueda      = searchTerm.trim();
                if (activeCategory)      filtros.id_categoria  = activeCategory;
                if (maxTime)             filtros.tiempo_max    = maxTime;
                if (ingredientFilter)    filtros.ingrediente   = ingredientFilter;

                if (selectedServing === '1-2') {
                    filtros.porciones_min = 1;
                    filtros.porciones_max = 2;
                } else if (selectedServing === '3-4') {
                    filtros.porciones_min = 3;
                    filtros.porciones_max = 4;
                } else if (selectedServing === '5+') {
                    filtros.porciones_min = 5;
                }

                const data = await getRecetas(filtros);
                setRecipes(data.recetas || []);
                //setTotal(data.total || 0);
                setTotal(data.total?.count || 0);
            } catch (err) {
                console.error(err);
                setRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecetas();
    }, [searchTerm, activeCategory, maxTime, selectedServing, ingredientFilter]);

    const resetFilters = () => {
        setSearchTerm('');
        setActiveCategory(null);
        setMaxTime(null);
        setSelectedServing('Cualquiera');
        setIngredientFilter('');
    };

    const hayFiltrosActivos = activeCategory || maxTime || selectedServing !== 'Cualquiera' || ingredientFilter || searchTerm;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#3d2b1f] relative overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-orange-50/60 rounded-full blur-[100px] -translate-x-1/4"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-green-50/60 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>
            </div>

            <Navbar initialSearch={searchTerm} />

            <div className="flex flex-col md:flex-row max-w-7xl mx-auto pt-8 pb-16 px-4 gap-12 relative z-10">

                {/* Sidebar Filtros */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="sticky top-28 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif font-bold text-2xl text-[#3d2b1f]">Filtros</h3>
                            {hayFiltrosActivos && (
                                <button
                                    onClick={resetFilters}
                                    className="text-xs font-bold text-[#f48c66] hover:text-[#e07b55] uppercase tracking-wide"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50 space-y-8">

                            {/* Categorías dinámicas */}
                            <div>
                                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Categorías</h4>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === null
                                            ? 'bg-[#3d2b1f] text-white shadow-lg'
                                            : 'text-gray-500 hover:bg-orange-50 hover:text-[#f48c66]'}`}
                                    >
                                        Todos
                                    </button>
                                    {categorias.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.id
                                                ? 'bg-[#3d2b1f] text-white shadow-lg'
                                                : 'text-gray-500 hover:bg-orange-50 hover:text-[#f48c66]'}`}
                                        >
                                            {cat.nombre}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100"></div>

                            {/* Tiempo */}
                            <div>
                                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Tiempo</h4>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'Todos', value: null },
                                        { label: '< 30 min', value: 30 },
                                        { label: '< 60 min', value: 60 },
                                    ].map(opt => (
                                        <button
                                            key={opt.label}
                                            onClick={() => setMaxTime(opt.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${maxTime === opt.value
                                                ? 'bg-orange-50 border-orange-200 text-[#f48c66]'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Porciones */}
                            <div>
                                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Porciones</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Cualquiera', '1-2', '3-4', '5+'].map(serving => (
                                        <button
                                            key={serving}
                                            onClick={() => setSelectedServing(serving)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold border text-center transition-all ${selectedServing === serving
                                                ? 'bg-orange-50 border-orange-200 text-[#f48c66]'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            {serving}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ingrediente */}
                            <div>
                                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">Ingrediente</h4>
                                <input
                                    type="text"
                                    value={ingredientFilter}
                                    onChange={(e) => setIngredientFilter(e.target.value)}
                                    placeholder="Ej: Pollo..."
                                    className="w-full bg-gray-50 border border-transparent rounded-xl pl-4 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f48c66]/20 transition-all font-medium text-[#3d2b1f]"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Resultados */}
                <main className="flex-1 min-h-[600px]">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <span className="text-xs font-bold text-[#f48c66] uppercase tracking-widest mb-1 block">Explorando</span>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3d2b1f]">
                                {searchTerm ? `"${searchTerm}"` : 'Todas las recetas'}
                            </h1>
                        </div>
                        <span className="text-sm font-medium px-4 py-2 bg-white rounded-full shadow-sm text-gray-500 border border-gray-100">
                            <span className="font-bold text-[#3d2b1f]">{total}</span> recetas encontradas
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#f48c66] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : recipes.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {recipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    {...recipe}
                                    isFavorite={isFavorite(recipe.id)}
                                    onToggleFavorite={() => toggleFavorite(recipe.id)}
                                    onClick={() => setSelectedRecipe(recipe)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                                <span className="text-6xl opacity-30">🔍</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-gray-400 mb-3">Sin resultados</h3>
                            <p className="text-gray-400 text-lg mb-8 max-w-md">
                                No encontramos recetas con esos filtros. ¡Intenta algo diferente!
                            </p>
                            <button
                                onClick={resetFilters}
                                className="px-8 py-3 bg-[#3d2b1f] hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                />
            )}
        </div>
    );
};

export default SearchResults;