import React from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Icon from '../ui/Icon'; // Added import for Icon component

const SettingsPanel = ({ config, setConfig, onSave, recipes = [] }) => {
    const toggleRecipe = (recipeId) => {
        let current = config.carouselIds || [];
        if (current.includes(recipeId)) {
            setConfig(prev => ({ ...prev, carouselIds: current.filter(id => id !== recipeId) }));
        } else {
            if (current.length >= 5) {
                alert('Máximo 5 recetas destacadas');
                return;
            }
            setConfig(prev => ({ ...prev, carouselIds: [...current, recipeId] }));
        }
    };

    return (
        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 space-y-6 h-fit">
                <h3 className="font-serif font-bold text-xl mb-4 text-[#3d2b1f]">Textos de Bienvenida</h3>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-4 border border-blue-100 flex gap-3">
                    <Icon name="info" className="shrink-0 mt-0.5" size={18} />
                    <p>Estos textos aparecerán en la sección principal de la página de inicio. Personaliza el título para tus visitantes.</p>
                </div>
                {['heroTitle', 'heroSubtitle', 'heroTagline'].map(key => (
                    <Input
                        key={key}
                        label={key.replace('hero', '')}
                        value={config[key] || ''}
                        onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={`Escribe el ${key.replace('hero', '').toLowerCase()}...`}
                    />
                ))}
            </Card>

            <Card className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-serif font-bold text-xl text-[#3d2b1f]">Carrusel Principal</h3>
                    <span className="text-xs font-bold bg-[#F3F0EC] px-3 py-1 rounded-full text-[#3d2b1f]/60">
                        {(config.carouselIds || []).length} / 5
                    </span>
                </div>

                <p className="text-sm text-[#3d2b1f]/60">Selecciona hasta 5 recetas para mostrar en el carrusel de inicio.</p>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {recipes.map(r => {
                        const isSelected = (config.carouselIds || []).includes(String(r.id));
                        return (
                            <div
                                key={r.id}
                                onClick={() => toggleRecipe(String(r.id))}
                                className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all hover:bg-[#FDFBF7] ${isSelected ? 'border-[#f48c66] bg-[#FFF0EB] shadow-sm' : 'border-[#E8DED5] bg-white'}`}
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#f48c66] border-[#f48c66]' : 'border-[#E8DED5]'}`}>
                                    {isSelected && <Icon name="check" size={14} className="text-white" stroke={3} />}
                                </div>
                                <img src={r.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-sm truncate ${isSelected ? 'text-[#f48c66]' : 'text-[#3d2b1f]'}`}>{r.title}</p>
                                    <p className="text-xs text-[#3d2b1f]/40 truncate">{r.category}</p>
                                </div>
                            </div>
                        );
                    })}
                    {recipes.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No hay recetas disponibles.</p>}
                </div>
            </Card>

            <div className="lg:col-span-2 pt-4 border-t border-[#E8DED5] flex justify-end">
                <Button variant="primary" className="w-full md:w-auto px-8" onClick={onSave} icon="check">Guardar Configuración</Button>
            </div>
        </div>
    );
};

export default SettingsPanel;
