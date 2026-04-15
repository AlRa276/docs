import React from 'react';

import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="bg-[#3d2b1f] text-white py-16 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Logo & Tagline */}
                <div className="flex flex-col items-center gap-4 mb-10 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg mb-2">
                        <Logo className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-3xl font-serif font-bold tracking-tight">
                        Ñam Ñam
                    </span>
                    <p className="text-white/60 text-sm max-w-md">
                        Descubre el placer de cocinar con recetas fáciles, deliciosas y hechas para compartir.
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="mb-12">
                    <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-white/80">
                        {['Inicio', 'Recetas', 'Blog', 'Nosotros', 'Contacto'].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-[#f48c66] transition-colors relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f48c66] transition-all group-hover:w-full"></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Social Icons */}
                <div className="flex gap-6 mb-12">
                    {['facebook', 'twitter', 'instagram', 'youtube'].map((social, idx) => (
                        <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#f48c66] flex items-center justify-center transition-all hover:scale-110 text-white/70 hover:text-white border border-white/10">
                            <span className="sr-only">{social}</span>
                            {/* Simple generic icon for now */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                {/* Copyright */}
                <div className="text-white/40 text-xs text-center flex flex-col md:flex-row items-center gap-2">
                    <p>© {new Date().getFullYear()} Ñam Ñam. Todos los derechos reservados.</p>
                    <span className="hidden md:inline">•</span>
                    <p>Hecho con <span className="text-red-400 animate-pulse">❤</span> y mucha hambre.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
