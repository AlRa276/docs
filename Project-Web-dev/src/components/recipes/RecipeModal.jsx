import React, { useState, useEffect } from 'react';
import useFavorites from '../../hooks/useFavorites';
import CookingMode from './CookingMode';
import CommentSection from './CommentSection';
import { getReceta } from '../../api/recetas'; // 👈 importar

const RecipeModal = ({ recipe, onClose }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [activeTab, setActiveTab] = useState('ingredients');
    const [isCookingMode, setIsCookingMode] = useState(false);
    const [detail, setDetail] = useState(null); // 👈 detalle completo
    const [loadingDetail, setLoadingDetail] = useState(true);

    // Cargar detalle completo al abrir
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoadingDetail(true);
                const data = await getReceta(recipe.id);
                setDetail(data.receta);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetail(false);
            }
        };
        fetchDetail();
    }, [recipe.id]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    if (!recipe) return null;
    if (isCookingMode) {
    const recipeForCooking = {
        ...recipe,
        steps: detail?.pasos?.map(paso => ({
            instruction: paso.instruccion,
            timer: paso.duracion_segundos
        })) || [],
        ingredients: detail?.ingredientes?.map(ing => ({
            name: ing.nombre,
            amount: `${ing.cantidad} ${ing.unidad}`
        })) || [],
    };
    return <CookingMode recipe={recipeForCooking} onClose={() => setIsCookingMode(false)} />;
}

    const favorite = isFavorite(recipe.id);

    // Mapear datos del detalle al formato que usa el modal
    const ingredients = detail?.ingredientes?.map(ing => ({
        name: ing.nombre,
        amount: `${ing.cantidad} ${ing.unidad}`
    })) || [];

    const steps = detail?.pasos?.map(paso => ({
        instruction: paso.instruccion,
        timer: paso.duracion_segundos
    })) || [];

    const description = detail?.descripcion || recipe.description;
    const category = detail?.categoria?.nombre || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="bg-white w-full max-w-6xl h-[85vh] md:h-[90vh] rounded-[40px] shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden transform transition-all">

                {/* Left Column */}
                <div className="w-full md:w-[45%] h-64 md:h-full relative shrink-0 group">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Close Mobile */}
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/20 backdrop-blur-md rounded-full text-white md:hidden hover:bg-white/40 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Favorite */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
                        className={`absolute top-6 left-6 p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-20 backdrop-blur-md border border-white/20 ${favorite ? 'bg-white text-[#f48c66]' : 'bg-white/30 text-white hover:bg-white hover:text-[#f48c66]'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={favorite ? 0 : 2} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>

                    {/* Title Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                ★ {recipe.rating}
                            </span>
                            {category && (
                                <span className="px-3 py-1 bg-[#f48c66] rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {category}
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-[1.1] mb-2 drop-shadow-md">{recipe.title}</h2>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                    <div className="hidden md:block absolute top-6 right-6 z-30">
                        <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 md:px-10 pt-8 pb-32 custom-scrollbar">

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8 bg-[#fafafa] p-4 rounded-2xl border border-gray-100">
                            <div className="flex flex-col items-center justify-center text-center gap-1 border-r border-gray-200/50">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tiempo</span>
                                <span className="font-serif font-bold text-[#3d2b1f] text-lg">{recipe.time}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center gap-1 border-r border-gray-200/50">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Porciones</span>
                                <span className="font-serif font-bold text-[#3d2b1f] text-lg">{recipe.servings} p.</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center gap-1">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Dificultad</span>
                                <span className="font-serif font-bold text-[#3d2b1f] text-lg">{recipe.difficulty}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed text-lg mb-8">
                            {description || "Una receta deliciosa y fácil de preparar."}
                        </p>

                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8 sticky top-0 z-20 backdrop-blur-xl">
                            {['ingredients', 'steps', 'comments'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-[#f48c66] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab === 'ingredients' ? 'Ingredientes' : tab === 'steps' ? 'Preparación' : 'Reseñas'}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {loadingDetail ? (
                            <div className="flex justify-center py-16">
                                <div className="w-8 h-8 border-4 border-[#f48c66] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300 min-h-[300px]">
                                {activeTab === 'ingredients' && (
                                    <ul className="space-y-3">
                                        {ingredients.length > 0 ? ingredients.map((ing, idx) => (
                                            <li key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-100 hover:shadow-sm transition-all group">
                                                <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f48c66] flex items-center justify-center shrink-0">
                                                    🥄
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#3d2b1f] text-lg">{ing.amount}</p>
                                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{ing.name}</p>
                                                </div>
                                            </li>
                                        )) : (
                                            <p className="text-gray-400 italic text-center py-8">No hay ingredientes listados.</p>
                                        )}
                                    </ul>
                                )}

                                {activeTab === 'steps' && (
                                    <div className="space-y-6 relative ml-4 border-l-2 border-dashed border-gray-200 pl-8 py-2">
                                        {steps.length > 0 ? steps.map((step, idx) => (
                                            <div key={idx} className="relative group">
                                                <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-orange-50 border-2 border-[#f48c66] text-[#f48c66] flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {idx + 1}
                                                </div>
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <p className="text-[#3d2b1f] leading-relaxed text-lg font-medium">{step.instruction}</p>
                                                    {step.timer > 0 && (
                                                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-[#f48c66] rounded-lg text-sm font-bold">
                                                            ⏱ {Math.floor(step.timer / 60)} min {step.timer % 60 > 0 ? `${step.timer % 60}s` : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-gray-400 italic text-center py-8">No hay pasos listados.</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'comments' && (
                                    <CommentSection recipeId={String(recipe.id)} />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Action */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center z-40">
                        <button
                            onClick={() => setIsCookingMode(true)}
                            className="bg-[#3d2b1f] hover:bg-black text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 w-full md:w-auto text-lg justify-center"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                            Iniciar Modo Cocina
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;