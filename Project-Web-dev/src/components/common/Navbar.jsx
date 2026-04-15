import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';

const Navbar = ({ initialSearch }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const { isAdmin } = useAdmin();

    useEffect(() => {
        setSearchTerm(initialSearch || '');
    }, [initialSearch]);

    // 👈 Leer usuario del token JWT
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch (err) {
                console.error('Token inválido:', err);
                localStorage.removeItem('token');
            }
        }
    }, []);

    // 👈 Cerrar sesión con JWT
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            }
        }
    };

    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        if (showMenu) window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">

                    {/* Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => navigate('/home')}>
                        <img src="/favicon.svg" alt="Ñam Ñam Logo" className="w-10 h-10 drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
                        <span className="text-2xl font-serif font-bold text-[#3d2b1f] tracking-tight group-hover:text-[#f48c66] transition-colors">
                            Ñam Ñam
                        </span>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-focus-within:text-[#f48c66] transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Buscar recetas, ingredientes..."
                            className="w-full bg-gray-100/50 hover:bg-gray-100 focus:bg-white border-0 rounded-2xl py-3 pl-12 pr-4 outline-none ring-1 ring-transparent focus:ring-[#f48c66]/30 focus:shadow-lg transition-all text-[#3d2b1f] placeholder:text-gray-400"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => navigate('/profile')} className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#f48c66] transition-all" title="Mis Favoritos">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>

                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f48c66] to-[#e07b55] p-0.5 shadow-md">
                                    <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center bg-gray-100 text-[#3d2b1f] font-bold text-sm">
                                        {getInitials(user?.nombre_mostrar || user?.correo)}
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-4 w-60 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 origin-top-right">
                                    <div className="px-5 py-4 border-b border-gray-100/50 mb-1">
                                        <p className="text-sm font-bold text-[#3d2b1f] truncate">{user?.nombre_mostrar || 'Usuario'}</p>
                                        <p className="text-xs text-gray-500 truncate font-medium">{user?.correo}</p>
                                    </div>

                                    <div className="px-2 space-y-0.5">
                                        {isAdmin && (
                                            <button onClick={() => navigate('/admin')} className="w-full text-left px-3 py-2.5 text-sm text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-xl flex items-center gap-3 transition-colors font-bold">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                </svg>
                                                Panel Admin
                                                <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                                            </button>
                                        )}
                                        <button onClick={() => navigate('/profile')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:text-[#3d2b1f] hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            Mi Perfil
                                        </button>
                                        <button onClick={() => navigate('/settings')} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:text-[#3d2b1f] hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Configuración
                                        </button>
                                    </div>

                                    <div className="h-px bg-gray-100 my-1 mx-2"></div>

                                    <div className="px-2">
                                        <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors font-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-2 md:hidden">
                        {isAdmin && (
                            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors">
                                Admin
                            </button>
                        )}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f48c66] to-[#e07b55] p-0.5 cursor-pointer" onClick={() => navigate('/profile')}>
                            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center bg-gray-100 text-[#3d2b1f] font-bold text-xs">
                                {getInitials(user?.nombre_mostrar || user?.correo)}
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            <div className="h-20" aria-hidden="true"></div>
        </>
    );
};

export default Navbar;