import React from 'react';
import RecipeCard from '../recipes/RecipeCard';
import useFavorites from '../../hooks/useFavorites';

const RecipeList = ({ recipes, onSelectRecipe }) => {
    const { isFavorite, toggleFavorite } = useFavorites();

    if (!recipes || recipes.length === 0) {
        return (
            <div className="col-span-full text-center py-16">
                <p className="text-xl text-gray-400">No se encontraron recetas con tu búsqueda 😔</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-in fade-in duration-500">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    isFavorite={isFavorite(recipe.id)}
                    onToggleFavorite={() => toggleFavorite(recipe.id)}
                    onClick={() => onSelectRecipe(recipe)}
                />
            ))}
        </div>
    );
};

export default RecipeList;
