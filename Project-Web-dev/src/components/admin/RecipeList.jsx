import React, { useState } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const RecipeList = ({ recipes, onEdit, onDelete }) => {
    const [search, setSearch] = useState('');

    const filteredRecipes = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="relative">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar receta..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-[#E8DED5] rounded-2xl shadow-sm text-sm focus:outline-none focus:border-[#f48c66] transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d2b1f]/30"><Icon name="search" /></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredRecipes.map(r => (
                    <div key={r.id} className="group bg-white rounded-2xl p-4 border border-[#E8DED5] shadow-sm hover:shadow-xl hover:shadow-[#3d2b1f]/5 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-[#F3F0EC] shrink-0">
                            <img src={r.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge type="accent">{r.category}</Badge>
                                {r.source === 'local' && <Badge type="outline">Local</Badge>}
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#3d2b1f] truncate">{r.title}</h3>
                            <p className="text-xs text-[#3d2b1f]/50 mt-1 truncate">{r.description || 'Sin descripción...'}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-x-4 sm:group-hover:translate-x-0 duration-300">
                            <Button variant="secondary" className="px-3" onClick={() => onEdit(r)}><Icon name="edit" size={16} /></Button>
                            <Button variant="danger" className="px-3 bg-red-50 text-red-500 hover:bg-red-100" onClick={() => onDelete(r)}><Icon name="trash" size={16} /></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeList;
