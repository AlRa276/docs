import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../hooks/useAdmin';
import useRecipes from '../hooks/useRecipes';
import { crearReceta, actualizarReceta, eliminarReceta, getReceta, getRecetasDestacadas } from '../api/recetas';
import { getComentarios, eliminarComentario, getTodosComentarios } from '../api/comentarios';
import { getConfiguracion, actualizarConfiguracion } from '../api/configuracion';

/* ─── COMPONENTS ─── */
import Sidebar from '../components/admin/Sidebar';
import RecipeEditor from '../components/admin/RecipeEditor';
import RecipeList from '../components/admin/RecipeList';
import CommentsList from '../components/admin/CommentsList';
import SettingsPanel from '../components/admin/SettingsPanel';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';

const AdminDashboard = () => {
    const { isAdmin, loading: authLoading, user } = useAdmin();
    const navigate = useNavigate();
    const { recipes, loading: recipesLoading } = useRecipes();

    const [view, setView] = useState('recipes');
    const [editing, setEditing] = useState(null);
    const [comments, setComments] = useState([]);
    const [config, setConfig] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });
    const closeToast = () => setToast(null);

    // Redirige si no es admin
    useEffect(() => {
        if (!authLoading && !isAdmin) navigate('/home');
    }, [authLoading, isAdmin, navigate]);

    // Carga comentarios y configuración al montar
    useEffect(() => {
        const loadData = async () => {
            try {
                const dataComentarios = await getTodosComentarios();
                setComments((dataComentarios.comentarios || []).map(c => ({
                    id:          c.id,
                    userName:    c.usuario?.nombre_mostrar,
                    userPhoto:   c.usuario?.url_foto,
                    recipeTitle: c.Recetum?.titulo,
                    text:        c.texto,
                    fecha:       c.fecha_creacion,
                })));

                const configData = await getConfiguracion();
                const c = configData.config || {};
                setConfig({
                    heroTitle:    c.title    || '',
                    heroSubtitle: c.subtitle || '',
                    heroTagline:  c.tagline  || '',
            
                });
            } catch (e) {
                console.error('Error al cargar datos:', e);
            }
        };

        if (isAdmin) loadData();
    }, [isAdmin]);

    useEffect(() => {
        if (!isAdmin || recipes.length === 0) return;
        
        const fetchDestacadas = async () => {
            try {
                const data = await getRecetasDestacadas();
                const ids = (data.recetas || []).map(r => String(r.id));
                setConfig(prev => ({ ...prev, carouselIds: ids }));
            } catch (err) {
                console.error('Error cargando destacadas:', err);
            }
        };
        fetchDestacadas();
    }, [isAdmin, recipes]);

    // ── Recetas ──────────────────────────────────────────────────────────

    const handleSaveRecipe = async (formData) => {
        try {
            // El RecipeEditor devuelve { title, category, time, servings, difficulty, image, description, ingredients, steps }
            // Hay que mapearlo al formato que espera tu API
            const receta = {
                titulo:                 formData.title,
                descripcion:            formData.description,
                dificultad:             formData.difficulty === 'Fácil' ? 'facil' : formData.difficulty === 'Medio' ? 'medio' : 'dificil',
                porciones:              Number(formData.servings),
                url_imagen:             formData.image,
                tiempo_prep_minutos:    parseInt(formData.time) || 0,
                tiempo_coccion_minutos: 0,
                es_destacada:           false,
            };

            const ingredientes = formData.ingredients.map(ing => ({
                nombre:   ing.name,
                cantidad: parseFloat(ing.amount) || 1,
                unidad:   'unidad',
            }));

            const pasos = formData.steps.map((step, idx) => ({
                numero_paso:       idx + 1,
                instruccion:       step.instruction,
                duracion_segundos: step.timer ? Number(step.timer) : null,
            }));

            if (editing === 'new') {
                await crearReceta({ receta, ingredientes, pasos });
                showToast('Receta creada exitosamente');
            } else {
                await actualizarReceta(editing.id, { receta, ingredientes, pasos });
                showToast('Receta actualizada correctamente');
            }

            setEditing(null);
        } catch (e) {
            console.error(e);
            showToast('Error al guardar la receta', 'error');
        }
    };

    const handleEdit = async (recipe) => {
    try {
        const data = await getReceta(recipe.id);
        const r = data.receta;
        setEditing({
            id:          r.id,
            title:       r.titulo,
            description: r.descripcion,
            image:       r.url_imagen,
            time:        `${r.tiempo_prep_minutos + r.tiempo_coccion_minutos}`,
            servings:    r.porciones,
            difficulty:  r.dificultad === 'facil' ? 'Fácil' : r.dificultad === 'medio' ? 'Medio' : 'Difícil',
            category:    r.categoria?.nombre || 'Pollo y carne',
            ingredients: r.ingredientes?.map(ing => ({
                amount: `${ing.cantidad} ${ing.unidad}`,
                name:   ing.nombre,
            })) || [{ amount: '', name: '' }],
            steps: r.pasos?.map(paso => ({
                instruction: paso.instruccion,
                timer:       paso.duracion_segundos || '',
            })) || [{ instruction: '' }],
        });
    } catch (err) {
        console.error(err);
        showToast('Error al cargar la receta', 'error');
    }
};

    const confirmDeleteRecipe = (r) => {
        setConfirm({
            title:       '¿Eliminar receta?',
            message:     `Estás a punto de eliminar "${r.title}". Esta acción no se puede deshacer.`,
            type:        'danger',
            confirmText: 'Sí, eliminar',
            onConfirm:   async () => {
                try {
                    await eliminarReceta(r.id);
                    showToast('Receta eliminada');
                } catch (e) {
                    showToast('Error al eliminar la receta', 'error');
                } finally {
                    setConfirm(null);
                }
            },
        });
    };

    // ── Comentarios ──────────────────────────────────────────────────────

    const confirmDeleteComment = (c) => {
        setConfirm({
            title:       '¿Eliminar comentario?',
            message:     'Esta acción eliminará el comentario permanentemente.',
            type:        'danger',
            confirmText: 'Eliminar',
            onConfirm:   async () => {
                try {
                    await eliminarComentario(c.id);
                    setComments(prev => prev.filter(com => com.id !== c.id));
                    showToast('Comentario eliminado');
                } catch (e) {
                    showToast('Error al eliminar el comentario', 'error');
                } finally {
                    setConfirm(null);
                }
            },
        });
    };

    // ── Configuración ────────────────────────────────────────────────────

    const handleSaveConfig = async () => {
        try {
            // 1. Guardar solo los campos permitidos
            await actualizarConfiguracion({
                title:    config.heroTitle,
                subtitle: config.heroSubtitle,
                tagline:  config.heroTagline,
                // ❌ sin carouselIds
            });

            // 2. Actualizar es_destacada en todas las recetas
            await Promise.all(
                recipes.map(r =>
                    actualizarReceta(r.id, {
                        receta: {
                            es_destacada: (config.carouselIds || []).includes(String(r.id))
                           
                        }
                    })
                )
            );

            showToast('Configuración guardada correctamente');
        } catch (e) {
            console.error(e);
            showToast('Error al guardar configuración', 'error');
        }
    };

    // ── Guards ───────────────────────────────────────────────────────────

    if (authLoading) return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#FDFBF7]">
            <div className="w-8 h-8 border-2 border-[#f48c66] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!isAdmin) return null;

    if (editing) return (
        <div className="h-screen w-screen absolute inset-0 z-50 bg-white">
            <RecipeEditor
                initial={editing === 'new' ? null : editing}
                onSave={handleSaveRecipe}
                onCancel={() => setEditing(null)}
                showToast={showToast}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    );

    return (
        <div className="h-screen bg-[#FDFBF7] flex flex-col md:flex-row font-sans text-[#3d2b1f] overflow-hidden">

            {/* Mobile Header */}
            <div className="md:hidden bg-[#2A1E16] text-[#FDFBF7] p-4 flex items-center justify-between shrink-0 shadow-xl z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#f48c66] rounded-lg flex items-center justify-center">
                        <span className="text-lg">👨‍🍳</span>
                    </div>
                    <span className="font-serif font-bold">Ñam Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
                    <Icon name={sidebarOpen ? 'x' : 'menu'} size={24} />
                </button>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <Sidebar
                view={view}
                setView={setView}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                user={user}
                commentsCount={comments.length}
            />

            <main className="flex-1 p-4 md:p-10 overflow-y-auto h-full w-full relative scroll-smooth">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div>
                        <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#3d2b1f] capitalize">
                            {view === 'recipes'  ? 'Gestión de Recetas' :
                             view === 'comments' ? 'Comentarios' : 'Configuración'}
                        </h2>
                        <p className="text-sm text-[#3d2b1f]/50 mt-1">
                            {view === 'recipes'  ? `Tienes ${recipes.length} recetas publicadas.` :
                             view === 'comments' ? 'Modera lo que dicen tus usuarios.' :
                             'Administra tu plataforma.'}
                        </p>
                    </div>
                    {view === 'recipes' && (
                        <Button
                            variant="primary"
                            onClick={() => setEditing('new')}
                            icon="plus"
                            className="w-full md:w-auto"
                        >
                            Crear Receta
                        </Button>
                    )}
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {view === 'recipes' && (
                        <RecipeList
                            recipes={recipes}
                            onEdit={handleEdit}
                            onDelete={confirmDeleteRecipe}
                        />
                    )}
                    {view === 'comments' && (
                        <CommentsList
                            comments={comments}
                            onDelete={confirmDeleteComment}
                        />
                    )}
                    {view === 'settings' && (
                        <SettingsPanel
                            config={config}
                            setConfig={setConfig}
                            onSave={handleSaveConfig}
                            recipes={recipes}
                        />
                    )}
                </div>
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
            <ConfirmModal
                isOpen={!!confirm}
                title={confirm?.title}
                message={confirm?.message}
                type={confirm?.type}
                confirmText={confirm?.confirmText}
                onConfirm={confirm?.onConfirm}
                onCancel={() => setConfirm(null)}
            />
        </div>
    );
};

export default AdminDashboard;