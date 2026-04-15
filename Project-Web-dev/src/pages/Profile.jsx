import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeModal from '../components/recipes/RecipeModal';
import useFavorites from '../hooks/useFavorites';
import { getPerfil, actualizarPerfil } from '../api/usuarios';
import { getFavoritos } from '../api/favoritos';
import { mapReceta } from '../api/recetas';

const Profile = () => {
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newBio, setNewBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const fileInputRef = useRef(null);

    // Cargar perfil
    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                setLoading(true);
                const usuario = await getPerfil();
                setUser(usuario);
                setNewName(usuario.nombre_mostrar || '');
                setNewBio(usuario.biografia || '');

                // Cargar favoritos
                const dataFav = await getFavoritos(usuario.id);
                setUserRecipes((dataFav.favoritos || []).map(fav => ({
                    id: fav.id,
                    title: fav.titulo,
                    image: fav.url_imagen,
                    time: `${(fav.tiempo_prep_minutos || 0) + (fav.tiempo_coccion_minutos || 0)} min`,
                    difficulty: fav.dificultad || '-',
                    rating: 0, // 👈 no viene del endpoint, se carga en el modal
                    servings: fav.porciones || '-',
                    description: fav.descripcion || '',
                    category: fav.categoria?.nombre || '',
                })));
            } catch (err) {
                console.error(err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, []);

    const handleUpdateProfile = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        setSaveError('');
        try {
            const updated = await actualizarPerfil(user.id, {
                nombre_mostrar: newName.trim(),
                biografia: newBio.trim(),
            });
            setUser(updated.usuario);
            setEditing(false);
        } catch (err) {
            setSaveError('No se pudo actualizar el perfil.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Máximo 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const updated = await actualizarPerfil(user.id, {
                    url_foto: reader.result,
                });
                setUser(updated.usuario);
            } catch (err) {
                console.error('Error actualizando foto:', err);
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#f48c66] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#3d2b1f] relative overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/50 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <Navbar />

            <div className="max-w-6xl mx-auto py-12 px-4 md:px-8 relative z-10">

                {/* Profile Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] border border-white/50 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f48c66]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">

                        {/* Foto */}
                        <div className="relative cursor-pointer group/photo" onClick={() => fileInputRef.current?.click()}>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full p-2 bg-white shadow-2xl relative z-10">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                                    {user.url_foto ? (
                                        <img src={user.url_foto} alt={user.nombre_mostrar} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#3d2b1f] text-white text-5xl font-serif font-bold">
                                            {user.nombre_mostrar?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-10 h-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-2 bg-[#f48c66] p-2.5 rounded-full shadow-lg text-white border-4 border-white z-20">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                </svg>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1 space-y-3">
                            {editing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Nombre"
                                        className="text-2xl font-serif font-bold text-[#3d2b1f] border-b-2 border-[#f48c66] outline-none bg-transparent w-full"
                                    />
                                    <textarea
                                        value={newBio}
                                        onChange={(e) => setNewBio(e.target.value)}
                                        placeholder="Escribe una biografía..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-[#f48c66] resize-none"
                                        rows={3}
                                    />
                                    {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={saving}
                                            className="px-6 py-2 bg-[#3d2b1f] text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-40 flex items-center gap-2"
                                        >
                                            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                                            Guardar
                                        </button>
                                        <button
                                            onClick={() => { setEditing(false); setSaveError(''); }}
                                            className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3d2b1f]">
                                            {user.nombre_mostrar || 'Usuario'}
                                        </h1>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="p-2 rounded-full text-gray-400 hover:text-[#f48c66] hover:bg-orange-50 transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-xl text-gray-500 font-light">{user.correo_electronico}</p>
                                    {user.biografia && (
                                        <p className="text-gray-600 max-w-lg">{user.biografia}</p>
                                    )}
                                </>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
                                <div className="bg-[#f0f4f0] px-6 py-3 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">💖</div>
                                    <div className="text-left">
                                        <span className="block text-xl font-bold text-[#3d2b1f] leading-none">{userRecipes.length}</span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Favoritas</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-2xl flex items-center gap-3 transition-colors text-gray-600 font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Configuración
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favoritos */}
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#f48c66] flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#3d2b1f]">Mis Recetas Guardadas</h2>
                        <span className="bg-gray-100 text-gray-500 font-bold px-3 py-1 rounded-full text-sm">{userRecipes.length}</span>
                    </div>

                    {userRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {userRecipes.map(recipe => (
                                <RecipeCard
                                    key={recipe.id}
                                    {...recipe}
                                    isFavorite={isFavorite(recipe.id)}
                                    onToggleFavorite={() => toggleFavorite(recipe.id)}
                                    onClick={() => setSelectedRecipe(recipe)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-6xl grayscale opacity-30">🥘</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-400 mb-2">Tu libro de cocina está vacío</h3>
                            <p className="text-gray-400 text-lg mb-8">Empieza a guardar las recetas que más te gusten.</p>
                            <button
                                onClick={() => navigate('/home')}
                                className="px-8 py-3 bg-[#3d2b1f] hover:bg-black text-white rounded-full font-bold shadow-xl transition-all hover:scale-105"
                            >
                                Explorar Recetas
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                />
            )}
        </div>
    );
};

export default Profile;