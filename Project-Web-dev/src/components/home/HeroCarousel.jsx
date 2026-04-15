import React, { useState, useEffect } from 'react';
import useFavorites from '../../hooks/useFavorites';

const HeroCarousel = ({ onSelectRecipe, recipes = [], carouselIds = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [animating, setAnimating] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();

    // Derive slides from props
    const slides = React.useMemo(() => {
        if (carouselIds && carouselIds.length > 0) {
            const featured = carouselIds
                .map(id => recipes.find(r => String(r.id) === String(id)))
                .filter(Boolean);
            if (featured.length > 0) return featured;
        }
        return recipes.slice(0, 5);
    }, [recipes, carouselIds]);

    const maxSlides = slides.length;
    const activeRecipe = slides[currentSlide];

    // Reset slide if out of bounds or recipes change
    useEffect(() => {
        if (currentSlide >= maxSlides) setCurrentSlide(0);
    }, [maxSlides]);

    // Animation on slide change
    useEffect(() => {
        setAnimating(true);
        const t = setTimeout(() => setAnimating(false), 500);
        return () => clearTimeout(t);
    }, [currentSlide]);

    // Auto-slide
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === maxSlides - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, isPaused, maxSlides]);

    const nextSlide = () => setCurrentSlide((prev) => (prev === maxSlides - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? maxSlides - 1 : prev - 1));

    if (!activeRecipe) return null;

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-16">
            <div
                className="bg-gradient-to-br from-[#e8f5e9] to-[#f1f8e9] rounded-[40px] p-8 md:p-16 relative overflow-hidden min-h-[600px] flex items-center shadow-2xl shadow-green-900/10 group transition-all duration-300 hover:shadow-green-900/20"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#dceddd] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 w-full h-full">

                    {/* Left: Text */}
                    <div className={`flex flex-col justify-center h-full order-2 md:order-1 transition-all duration-500 transform ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-brand-green font-bold text-xs tracking-widest uppercase shadow-sm border border-green-100">
                                Receta del Día
                            </span>
                            <span className="px-4 py-1.5 bg-orange-100/80 backdrop-blur-sm rounded-full text-brand-orange font-bold text-xs tracking-widest uppercase shadow-sm border border-orange-100 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                                </svg>
                                {activeRecipe.category}
                            </span>
                        </div>

                        <h1 className="font-serif font-bold text-[#3d2b1f] text-4xl sm:text-5xl md:text-7xl mb-6 leading-[1.1] tracking-tight">
                            {activeRecipe.title}
                        </h1>

                        <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-xl">
                            {activeRecipe.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mb-10 text-sm font-medium text-gray-500 bg-white/50 backdrop-blur-sm p-4 rounded-2xl w-fit border border-white/50">
                            <div className="flex items-center gap-2" title="Tiempo de preparación">
                                <span className="p-2 bg-white rounded-full text-brand-orange shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                {activeRecipe.time}
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="flex items-center gap-2" title="Dificultad">
                                <span className="p-2 bg-white rounded-full text-brand-green shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                </span>
                                {activeRecipe.difficulty}
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="flex items-center gap-2" title="Porciones">
                                <span className="p-2 bg-white rounded-full text-brand-brown shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </span>
                                {activeRecipe.servings}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => onSelectRecipe(activeRecipe)}
                                className="px-8 py-4 rounded-full bg-[#3d2b1f] text-white font-bold text-lg hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-brown/20 flex items-center gap-3"
                            >
                                Ver Receta Completa
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(activeRecipe.id); }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg border-2 ${isFavorite(activeRecipe.id) ? 'bg-[#f48c66] border-[#f48c66] text-white' : 'bg-white border-white text-gray-400 hover:text-[#f48c66]'}`}
                                title={isFavorite(activeRecipe.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite(activeRecipe.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFavorite(activeRecipe.id) ? 0 : 2} className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative flex justify-center items-center order-1 md:order-2 h-full">
                        <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-white rounded-full opacity-40 animate-pulse"></div>
                        <div className={`relative z-10 w-64 h-64 sm:w-80 sm:h-80 md:w-[450px] md:h-[450px] transition-all duration-700 transform ${animating ? 'scale-90 opacity-50 rotate-6' : 'scale-100 opacity-100 rotate-0'}`}>
                            <img
                                src={activeRecipe.image}
                                alt={activeRecipe.title}
                                className="w-full h-full object-cover rounded-full shadow-2xl border-8 border-white ring-1 ring-black/5 hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                            <div className="absolute -bottom-4 right-10 md:right-20 bg-white py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                                <span className="text-brand-orange text-2xl">★</span>
                                <div>
                                    <p className="font-bold text-[#3d2b1f] text-lg leading-none">{activeRecipe.rating}</p>
                                    <p className="text-xs text-gray-500 font-medium">Calificación</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-md text-[#3d2b1f] flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-20 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-md text-[#3d2b1f] flex items-center justify-center transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 z-20 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {/* Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${currentSlide === idx ? 'w-8 bg-[#3d2b1f]' : 'w-2.5 bg-[#3d2b1f]/40 hover:bg-[#3d2b1f]/60'}`}
                            aria-label={`Ir a la diapositiva ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
