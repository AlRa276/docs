import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import RecipeModal from '../components/recipes/RecipeModal';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryFilter from '../components/home/CategoryFilter';
import RecipeList from '../components/home/RecipeList';
import useRecipes from '../hooks/useRecipes';
import useCategorias from '../hooks/useCategorias';
import { getRecetasDestacadas, mapReceta } from '../api/recetas';
import { getConfiguracion } from '../api/configuracion';

const Home = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // 👈 faltaba esto
    const [siteConfig, setSiteConfig] = useState(null);
    const [destacadas, setDestacadas] = useState([]);

    const { categorias } = useCategorias();
    const { recipes, loading } = useRecipes(
        activeTab ? { id_categoria: activeTab } : {}
    );

    useEffect(() => {
        const fetchDestacadas = async () => {
            try {
                const data = await getRecetasDestacadas();
                setDestacadas((data.recetas || []).map(mapReceta));
            } catch (err) {
                console.error('Error cargando destacadas:', err);
            }
        };
        fetchDestacadas();
    }, []);
    
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await getConfiguracion();
                setSiteConfig(data.config || {});
            } catch (err) {
                console.error('Error cargando config:', err);
            }
        };
        fetchConfig();
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] overflow-x-hidden relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
            </div>

            <Navbar />

            <div className="relative z-10 pt-4 pb-12">
                <HeroCarousel
                    recipes={destacadas}
                    onSelectRecipe={setSelectedRecipe}
                />
            </div>

            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="text-center md:text-left">
                        <span className="text-[#f48c66] font-bold tracking-widest uppercase text-sm mb-2 block">
                            {siteConfig?.tagline || 'Explora el Menú'}
                        </span>
                        <h2 className="heading-serif text-3xl md:text-5xl text-[#3d2b1f] relative inline-block">
                            {siteConfig?.title || 'Recetas Destacadas'}
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#f48c66] opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </h2>
                    </div>

                    {/* 👇 Pasa categorias al filtro */}
                    <CategoryFilter
                        categorias={categorias}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                {/* 👇 Usa recipes directo, el backend ya filtró */}
                <RecipeList recipes={recipes} onSelectRecipe={setSelectedRecipe} />
            </section>

            <Footer />

            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                />
            )}
        </div>
    );
};

export default Home;