import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';

const Sidebar = ({ view, setView, sidebarOpen, setSidebarOpen, user, commentsCount }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'recipes', label: 'Mis Recetas', icon: 'grid' },
        { id: 'comments', label: 'Comentarios', icon: 'message', badge: commentsCount },
        { id: 'settings', label: 'Configuración', icon: 'settings' }
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-[#2A1E16] text-[#FDFBF7] flex flex-col transition-transform duration-300 shadow-2xl
            md:translate-x-0 md:static md:shadow-none md:h-screen md:sticky md:top-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Header */}
            <div className="p-8 pb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-[#f48c66] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f48c66]/20 rotate-3 transition-transform hover:rotate-6">
                        <span className="text-2xl">👨‍🍳</span>
                    </div>
                    <div>
                        <h1 className="font-serif font-bold text-2xl leading-tight text-white tracking-tight">Ñam Studio</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f48c66]">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Close Button */}
            <div className="md:hidden absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/50 hover:text-white"><Icon name="x" /></button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 mt-4">Menú Principal</p>
                {menuItems.map(item => (
                    <button key={item.id} onClick={() => { setView(item.id); setSidebarOpen(false); }}
                        className={`group w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${view === item.id ? 'bg-[#f48c66] text-white shadow-xl shadow-[#f48c66]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>

                        {/* Active Indicator */}
                        {view === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />}

                        <Icon name={item.icon} size={20} className={view === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} />
                        <span className="flex-1 text-left tracking-wide">{item.label}</span>
                        {item.badge > 0 && (
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${view === item.id ? 'bg-white text-[#f48c66]' : 'bg-[#f48c66] text-white'}`}>
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* User & Footer */}
            <div className="p-6 mt-auto">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-5 border border-white/5 mb-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#f48c66] flex items-center justify-center font-bold text-sm text-white border-2 border-[#2A1E16] shadow-sm">
                            {user?.displayName?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">{user?.displayName || 'Admin'}</p>
                            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate('/home')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all text-center uppercase tracking-wider">
                    <Icon name="arrowLeft" size={14} />
                    Volver al Sitio
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
