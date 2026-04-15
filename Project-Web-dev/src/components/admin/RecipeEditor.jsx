import React, { useState } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { compressImage } from '../../utils/imageUtils';

const RecipeEditor = ({ initial, onSave, onCancel, showToast }) => {
    const [form, setForm] = useState(initial || {
        title: '', category: 'Pollo y carne', time: '', servings: 2, difficulty: 'Fácil', image: '', description: '',
        ingredients: [{ amount: '', name: '' }], steps: [{ instruction: '' }]
    });
    const [preview, setPreview] = useState(initial?.image || null);
    const [saving, setSaving] = useState(false);

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                if (showToast) showToast('La imagen es muy pesada (Max 2MB)', 'error');
                else alert('Imagen muy pesada');
                return;
            }
            try {
                const b64 = await compressImage(file);
                setPreview(b64);
                handleChange('image', b64);
            } catch (err) {
                console.error(err);
                if (showToast) showToast('Error al procesar imagen', 'error');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.title || !form.image) {
            if (showToast) showToast('El título y la imagen son obligatorios', 'error');
            else alert('Faltan datos');
            return;
        }

        setSaving(true);
        await onSave(form);
        setSaving(false);
    }

    return (
        <div className="h-full flex flex-col bg-[#FDFBF7]">
            {/* Toolbar */}
            <div className="px-4 md:px-8 py-5 border-b border-[#E8DED5] bg-white sticky top-0 z-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-[#3d2b1f]/5 transition-colors">
                        <Icon name="arrowLeft" size={20} className="text-[#3d2b1f]" />
                    </button>
                    <div>
                        <h2 className="font-serif font-bold text-lg md:text-xl text-[#3d2b1f] leading-none">
                            {initial ? 'Editar Receta' : 'Nueva Creación'}
                        </h2>
                        <p className="hidden md:block text-xs text-[#3d2b1f]/40 font-medium mt-1">Detalles de la receta</p>
                    </div>
                </div>
                <div className="flex gap-2 md:gap-3">
                    <Button variant="ghost" onClick={onCancel} className="hidden md:flex">Descartar</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving} icon="check">
                        {saving ? '...' : 'Publicar'}
                    </Button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">

                    {/* Left Panel: Media & Meta */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3F0EC] border-2 border-dashed border-[#E8DED5] group transition-all hover:border-[#f48c66]">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#3d2b1f]/30 gap-2">
                                    <Icon name="image" size={32} />
                                    <span className="text-xs font-bold uppercase tracking-wide">Subir Foto</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-[#3d2b1f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-bold text-sm flex items-center gap-2"><Icon name="upload" size={16} /> Cambiar</span>
                            </div>
                            <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>

                        <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#E8DED5]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#3d2b1f]/40 mb-4">Información Rápida</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input label="Tiempo" placeholder="Ej: 45 min" value={form.time} onChange={e => handleChange('time', e.target.value)} />
                                    {form.steps.some(s => s.timer) && (
                                        <div className="mt-1.5 flex items-center justify-between text-[10px] bg-[#f48c66]/10 p-1.5 rounded-lg border border-[#f48c66]/20">
                                            <span className="text-[#3d2b1f]/80 font-medium">
                                                Suma de pasos: <strong>{Math.floor(form.steps.reduce((acc, s) => acc + (parseInt(s.timer) || 0), 0) / 60)} min</strong>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleChange('time', `${Math.floor(form.steps.reduce((acc, s) => acc + (parseInt(s.timer) || 0), 0) / 60)} min`)}
                                                className="text-[#f48c66] font-bold hover:underline ml-2"
                                            >
                                                Usar
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <Input label="Porciones" type="number" placeholder="2" value={form.servings} onChange={e => handleChange('servings', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3d2b1f]/40 mb-1.5">Dificultad</label>
                                <div className="flex bg-[#FDFBF7] p-1 rounded-xl border border-[#E8DED5]">
                                    {['Fácil', 'Medio', 'Difícil'].map(d => (
                                        <button key={d} type="button" onClick={() => handleChange('difficulty', d)}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${form.difficulty === d ? 'bg-white text-[#f48c66] shadow-sm' : 'text-[#3d2b1f]/40 hover:text-[#3d2b1f]'}`}>
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3d2b1f]/40 mb-1.5">Categoría</label>
                                <select className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E8DED5] rounded-xl text-[#3d2b1f] font-medium focus:outline-none focus:border-[#f48c66]"
                                    value={form.category} onChange={e => handleChange('category', e.target.value)}>
                                    {['Pollo y carne', 'Saludable', 'Ensalada', 'Guarniciones', 'Postres'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Content */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-[#E8DED5] shadow-sm mb-8">
                            <h3 className="font-serif font-bold text-xl text-[#3d2b1f] mb-4">Detalles Principales</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3d2b1f]/40 mb-1.5">Título de la Receta</label>
                                    <input
                                        placeholder="Ej: Pollo al Horno"
                                        className="w-full text-2xl font-serif font-bold text-[#3d2b1f] placeholder:text-[#3d2b1f]/20 bg-[#FDFBF7] border border-[#E8DED5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#f48c66] transition-all"
                                        value={form.title}
                                        onChange={e => handleChange('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3d2b1f]/40 mb-1.5">Descripción Corta</label>
                                    <textarea
                                        placeholder="Describe la historia detrás de este platillo..."
                                        rows={3}
                                        className="w-full text-sm leading-relaxed text-[#3d2b1f] placeholder:text-[#3d2b1f]/30 bg-[#FDFBF7] border border-[#E8DED5] rounded-xl px-4 py-3 focus:outline-none focus:border-[#f48c66] resize-none transition-all"
                                        value={form.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Ingredients */}
                            <section className="bg-white p-6 rounded-2xl border border-[#E8DED5] shadow-sm">
                                <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E8DED5]">
                                    <h3 className="font-serif font-bold text-xl text-[#3d2b1f]">Ingredientes</h3>
                                    <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => handleChange('ingredients', [...form.ingredients, { amount: '', name: '' }])} icon="plus">Añadir</Button>
                                </div>
                                <div className="space-y-3">
                                    {form.ingredients.map((ing, i) => (
                                        <div key={i} className="flex gap-4 group items-start">
                                            <div className="w-6 h-6 rounded-full border-2 border-[#E8DED5] mt-2 shrink-0 flex items-center justify-center text-[10px] font-bold text-[#3d2b1f]/40">{i + 1}</div>
                                            <div className="flex-1 flex gap-3">
                                                <input className="w-24 px-3 py-2 bg-[#FDFBF7] border border-[#E8DED5] rounded-lg text-sm font-bold text-[#f48c66] placeholder:text-[#f48c66]/30 focus:border-[#f48c66] outline-none transition-all" placeholder="Cant." value={ing.amount} onChange={e => { const n = [...form.ingredients]; n[i].amount = e.target.value; handleChange('ingredients', n); }} />
                                                <input className="flex-1 px-3 py-2 bg-[#FDFBF7] border border-[#E8DED5] rounded-lg text-sm font-medium text-[#3d2b1f] focus:border-[#f48c66] outline-none transition-all" placeholder="Nombre del ingrediente" value={ing.name} onChange={e => { const n = [...form.ingredients]; n[i].name = e.target.value; handleChange('ingredients', n); }} />
                                            </div>
                                            <button onClick={() => handleChange('ingredients', form.ingredients.filter((_, x) => x !== i))} className="p-2 text-[#3d2b1f]/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all mt-0.5"><Icon name="trash" size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Steps */}
                            <section className="bg-white p-6 rounded-2xl border border-[#E8DED5] shadow-sm">
                                <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E8DED5]">
                                    <h3 className="font-serif font-bold text-xl text-[#3d2b1f]">Preparación</h3>
                                    <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => handleChange('steps', [...form.steps, { instruction: '', timer: '' }])} icon="plus">Añadir Paso</Button>
                                </div>
                                <div className="space-y-6">
                                    {form.steps.map((step, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center font-bold font-serif text-sm shadow-lg shadow-[#3d2b1f]/20 z-10">{i + 1}</span>
                                                {i !== form.steps.length - 1 && <div className="w-0.5 flex-1 bg-[#E8DED5]" />}
                                            </div>
                                            <div className="flex-1 pt-1 space-y-3">
                                                <textarea
                                                    rows={2}
                                                    className="w-full p-4 bg-[#FDFBF7] border border-[#E8DED5] rounded-xl text-[#3d2b1f] text-sm leading-relaxed focus:border-[#f48c66] focus:ring-1 focus:ring-[#f48c66] outline-none transition-all placeholder:text-[#3d2b1f]/30 resize-none"
                                                    placeholder={`Describe el paso ${i + 1}...`}
                                                    value={step.instruction}
                                                    onChange={e => { const n = [...form.steps]; n[i].instruction = e.target.value; handleChange('steps', n); }}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Icon name="grid" size={14} className="text-[#3d2b1f]/40" />
                                                    <span className="text-xs font-bold uppercase tracking-wide text-[#3d2b1f]/40">Temporizador:</span>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-20 px-2 py-1 bg-[#FDFBF7] border border-[#E8DED5] rounded-lg text-sm font-bold text-[#f48c66] focus:border-[#f48c66] outline-none transition-all"
                                                        value={step.timer || ''}
                                                        onChange={e => { const n = [...form.steps]; n[i].timer = e.target.value; handleChange('steps', n); }}
                                                    />
                                                    <span className="text-xs text-[#3d2b1f]/40">segundos (opcional)</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleChange('steps', form.steps.filter((_, x) => x !== i))} className="p-2 text-[#3d2b1f]/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all h-fit mt-1"><Icon name="trash" size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeEditor;
