import React, { useState, useEffect } from 'react';
import { getComentarios, crearComentario, eliminarComentario } from '../../api/comentarios';
import { getValoraciones, guardarValoracion, eliminarValoracion } from '../../api/valoraciones';

// ─── Utilidades ──────────────────────────────────────────────────────────────
const timeAgo = (timestamp) => {
    if (!timestamp) return 'ahora';
    const date = new Date(timestamp);
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return `hace ${Math.floor(diff / 86400)} días`;
};

const Avatar = ({ userName, userPhoto, size = 'md' }) => {
    const sizeClass = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm' }[size];
    const initial = userName ? userName[0].toUpperCase() : 'U';
    return userPhoto
        ? <img src={userPhoto} alt={userName} className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm shrink-0`} />
        : <div className={`${sizeClass} rounded-full bg-[#3d2b1f] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm shrink-0`}>{initial}</div>;
};

const StarRating = ({ value, onChange, size = 'md', readOnly = false }) => {
    const [hovered, setHovered] = useState(0);
    const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6' }[size];
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" disabled={readOnly}
                    onClick={() => !readOnly && onChange?.(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    className={`transition-transform ${!readOnly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        className={`${sizeClass} transition-colors ${(hovered || value) >= star ? 'text-amber-400' : 'text-gray-200'}`}>
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

// ─── Componente Principal ────────────────────────────────────────────────────
const CommentSection = ({ recipeId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [valoraciones, setValoraciones] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Obtener usuario del token JWT
    const token = localStorage.getItem('token');
    const currentUserId = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;
   
    // ── Cargar datos ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!recipeId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dataComentarios, dataValoraciones] = await Promise.all([
                    getComentarios(recipeId),
                    getValoraciones(recipeId),
                ]);
                setComentarios(dataComentarios.comentarios || []);
                setValoraciones(dataValoraciones.valoraciones || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [recipeId]);

    // ── Estadísticas ──────────────────────────────────────────────────────────
    const avgRating = valoraciones.length > 0
        ? Number((valoraciones.reduce((acc, v) => acc + v.puntuacion, 0) / valoraciones.length).toFixed(1))
        : 0;

    const miValoracion = valoraciones.find(v => v.id_usuario === currentUserId);

    // ── Enviar ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) { setError('Debes iniciar sesión para comentar.'); return; }
        if (!newComment.trim() && rating === 0) { setError('Escribe un comentario o selecciona una calificación.'); return; }

        setError('');
        setSubmitting(true);
        try {
            // Guardar comentario si hay texto
            if (newComment.trim()) {
                const res = await crearComentario(recipeId, { texto: newComment.trim() });
                // Agregar optimistamente a la lista
                setComentarios(prev => [{
                    id: res.id,
                    id_usuario: currentUserId,
                    texto: newComment.trim(),
                    fecha_creacion: new Date().toISOString(),
                    usuario: { nombre_mostrar: 'Tú', url_foto: null }
                }, ...prev]);
            }

            // Guardar valoración si hay rating
            if (rating > 0) {
                await guardarValoracion(recipeId, { puntuacion: rating });
                // Actualizar valoraciones localmente
                if (miValoracion) {
                    setValoraciones(prev => prev.map(v =>
                        v.id_usuario === currentUserId ? { ...v, puntuacion: rating } : v
                    ));
                } else {
                    setValoraciones(prev => [{
                        id: Date.now(),
                        id_usuario: currentUserId,
                        puntuacion: rating,
                        usuario: { nombre_mostrar: 'Tú', url_foto: null }
                    }, ...prev]);
                }
            }

            setNewComment('');
            setRating(0);
        } catch (err) {
            console.error(err);
            setError('No se pudo publicar. Inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Eliminar comentario ───────────────────────────────────────────────────
    const handleDeleteComment = async (id, id_usuario) => {
        if (id_usuario !== currentUserId) return;
        try {
            await eliminarComentario(id);
            setComentarios(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // ── Eliminar valoración ───────────────────────────────────────────────────
    const handleDeleteValoracion = async (id, id_usuario) => {
        if (id_usuario !== currentUserId) return;
        try {
            await eliminarValoracion(id);
            setValoraciones(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="mt-6">
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">
                    Reseñas <span className="text-gray-400 font-normal text-base">({comentarios.length})</span>
                </h3>
                {avgRating > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                        <StarRating value={Math.round(avgRating)} readOnly size="sm" />
                        <span className="font-bold text-amber-700 text-sm">{avgRating}</span>
                        <span className="text-amber-400 text-xs">({valoraciones.length})</span>
                    </div>
                )}
            </div>

            {/* ── Formulario ── */}
            {token ? (
                <form onSubmit={handleSubmit} className="mb-6 bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                    <div className="space-y-3">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Calificación:</span>
                            <StarRating value={rating} onChange={setRating} size="md" />
                            {rating > 0 && (
                                <button type="button" onClick={() => setRating(0)}
                                    className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                                    quitar
                                </button>
                            )}
                            {miValoracion && (
                                <span className="text-xs text-amber-600 font-medium">
                                    (Tu calificación actual: {miValoracion.puntuacion}★)
                                </span>
                            )}
                        </div>

                        {/* Textarea */}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Comparte tu experiencia con esta receta..."
                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-[#f48c66] transition-colors resize-none"
                            rows={3}
                        />

                        {error && <p className="text-red-500 text-xs">{error}</p>}

                        <div className="flex justify-end">
                            <button type="submit"
                                disabled={submitting || (!newComment.trim() && rating === 0)}
                                className="px-5 py-2 bg-[#3d2b1f] text-white text-sm font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                                {submitting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Publicando...</>
                                ) : 'Publicar'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                    <p className="text-amber-800 text-sm font-medium">
                        <span className="font-bold">Inicia sesión</span> para dejar una reseña.
                    </p>
                </div>
            )}

            {/* ── Valoraciones ── */}
            {valoraciones.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Calificaciones</h4>
                    <div className="space-y-2">
                        {valoraciones.map(v => (
                            <div key={v.id} className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-100 rounded-xl group">
                                <div className="flex items-center gap-2">
                                    <Avatar userName={v.usuario?.nombre_mostrar} userPhoto={v.usuario?.url_foto} size="sm" />
                                    <span className="text-sm font-bold text-[#3d2b1f]">{v.usuario?.nombre_mostrar}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StarRating value={v.puntuacion} readOnly size="sm" />
                                    {v.id_usuario === currentUserId && (
                                        <button onClick={() => handleDeleteValoracion(v.id, v.id_usuario)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Lista de comentarios ── */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#f48c66] rounded-full animate-spin"></div>
                </div>
            ) : comentarios.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-400 text-sm">Sé el primero en dejar un comentario.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comentarios.map(c => (
                        <div key={c.id} className="flex gap-3 group">
                            <Avatar userName={c.usuario?.nombre_mostrar} userPhoto={c.usuario?.url_foto} size="sm" />
                            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div>
                                        <span className="font-bold text-sm text-[#3d2b1f]">{c.usuario?.nombre_mostrar}</span>
                                        <span className="text-xs text-gray-400 ml-2">{timeAgo(c.fecha_creacion)}</span>
                                    </div>
                                    {c.id_usuario === currentUserId && (
                                        <button onClick={() => handleDeleteComment(c.id, c.id_usuario)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{c.texto}</p>
                                {c.id_respuesta_a && (
                                    <span className="text-xs text-gray-400 mt-1 block">↩ En respuesta a otro comentario</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;