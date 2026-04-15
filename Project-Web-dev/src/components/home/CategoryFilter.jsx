import React from 'react';
import { categories } from '../../data/recipes';

// Icon mapping function
const getIcon = (name) => {
    switch (name) {
        case 'squares':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            );
        case 'fire':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.83 8.83 0 003 2.48z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                </svg>
            );
        case 'leaf':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            );
        case 'bowl':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 6.75a3 3 0 013-3h10.5a3 3 0 013 3m-16.5 0v10.5a3 3 0 003 3h10.5a3 3 0 003-3V6.75" />
                </svg>
            );
        case 'pot':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
            );
        case 'cake':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.043.163-2.767.22-3.419 2.303-4.092 4.418-.542 1.745-2.028 5.417-2.147 6.133a.75.75 0 00.748.868h18.99a.75.75 0 00.748-.868c-.116-.716-1.603-4.388-2.148-6.133-.672-2.115-1.325-4.198-4.091-4.418-.323-.026-.65-.045-.98-.06" />
                </svg>
            );
        default:
            return null;
    }
};

const CategoryFilter = ({ categorias, activeTab, setActiveTab }) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {/* Botón "Todos" siempre fijo */}
            <button
                onClick={() => setActiveTab(null)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border
                    ${activeTab === null
                        ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-lg -translate-y-1'
                        : 'bg-white text-gray-500 border-gray-100 hover:border-[#f48c66] hover:text-[#f48c66]'
                    }`}
            >
                Todos
            </button>

            {/* Categorías dinámicas de la API */}
            {categorias.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border
                        ${activeTab === cat.id
                            ? 'bg-[#3d2b1f] text-white border-[#3d2b1f] shadow-lg -translate-y-1'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-[#f48c66] hover:text-[#f48c66]'
                        }`}
                >
                    {cat.nombre}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
