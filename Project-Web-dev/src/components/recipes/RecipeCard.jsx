import React from 'react';

const RecipeCard = ({ title, time, servings, difficulty, rating, image, isFavorite, onToggleFavorite, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-white rounded-[32px] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full overflow-visible border border-gray-100/50"
        >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[32px] pointer-events-none"></div>

            {/* Top Badges */}
            <div className="flex justify-between items-start mb-6 relative z-20">
                <div className="bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-orange-100">
                    <span className="text-[#f48c66] text-sm">★</span>
                    <span className="font-bold text-[#3d2b1f] text-sm">{rating}</span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    className={`p-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 ${isFavorite ? 'bg-red-50 text-red-500 animate-heartbeat' : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFavorite ? 0 : 2} className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            </div>

            {/* Floating Image */}
            <div className="relative mb-6 flex justify-center perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-b from-[#f48c66]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full scale-125"></div>
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-2 bg-white shadow-xl transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-3 relative z-10">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="mt-auto text-center relative z-10">
                <h3 className="font-serif font-bold text-2xl text-[#3d2b1f] mb-3 leading-tight group-hover:text-[#f48c66] transition-colors line-clamp-2 min-h-[3rem]">
                    {title}
                </h3>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Tiempo</span>
                        <span className="font-medium text-gray-700">{time}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Dificultad</span>
                        <span className={`font-medium ${difficulty === 'Fácil' ? 'text-green-600' : difficulty === 'Medio' ? 'text-yellow-600' : 'text-red-500'}`}>
                            {difficulty}
                        </span>
                    </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 absolute -bottom-5 left-0 right-0 hidden md:flex justify-center z-30">
                    <span className="inline-block px-6 py-2 bg-[#3d2b1f] text-white text-sm font-bold rounded-full shadow-xl ring-2 ring-white">
                        Ver Receta
                    </span>
                </div>
                {/* Mobile visible button */}
                <div className="md:hidden mt-2">
                    <span className="text-[#f48c66] font-bold text-sm">Toca para ver receta</span>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
