import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { eliminarUsuario } from '../api/usuarios';

const Settings = () => {
    const navigate = useNavigate();
    const [emailAlert, setEmailAlert] = useState(() => {
        return JSON.parse(localStorage.getItem('namNamEmailAlert')) ?? true;
    });
    const [pushAlert, setPushAlert] = useState(() => {
        return JSON.parse(localStorage.getItem('namNamPushAlert')) ?? false;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('namNamEmailAlert', JSON.stringify(emailAlert));
    }, [emailAlert]);

    useEffect(() => {
        localStorage.setItem('namNamPushAlert', JSON.stringify(pushAlert));
    }, [pushAlert]);

    const handlePasswordReset = async () => {
        if (!auth.currentUser?.email) return;
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, auth.currentUser.email);
            alert(`Se ha enviado un correo de recuperación a ${auth.currentUser.email}`);
        } catch (e) {
            console.error(e);
            alert("Error al enviar el correo. Por favor intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción es permanente y no se puede deshacer. Perderás todas tus recetas guardadas."
        );
        if (!confirmed) return;

        const token = localStorage.getItem('token');
        const currentUserId = token
            ? JSON.parse(atob(token.split('.')[1]))?.id
            : null;

        if (!currentUserId) return;

        setLoading(true);
        try {
            await eliminarUsuario(currentUserId);
            localStorage.removeItem('token');
            alert("Tu cuenta ha sido eliminada.");
            navigate('/');
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
            alert("Ocurrió un error al intentar eliminar la cuenta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#3d2b1f] relative overflow-x-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -translate-x-1/4"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>
            </div>

            <Navbar />

            <div className="max-w-3xl mx-auto py-12 px-4 relative z-10 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-white p-2.5 rounded-xl text-gray-400 hover:text-[#3d2b1f] hover:shadow-md transition-all border border-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-[#3d2b1f] flex items-center gap-3">
                        Configuración de Cuenta
                    </h1>
                </div>

                {/* Notifications Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-white/50 p-8 mb-8 space-y-8">
                    <div className="border-b border-gray-100 pb-4 mb-4">
                        <h2 className="font-bold text-xl text-[#3d2b1f] mb-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#f48c66]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            Preferencias de Notificación
                        </h2>
                    </div>

                    <div className="flex items-center justify-between group">
                        <div className="pr-4">
                            <h4 className="font-bold text-[#3d2b1f] mb-1">Boletines por correo</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Recibe nuestras mejores recetas semanales y trucos de cocina directamente en tu bandeja.</p>
                        </div>
                        <button
                            onClick={() => setEmailAlert(!emailAlert)}
                            className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${emailAlert ? 'bg-[#f48c66]' : 'bg-gray-200'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${emailAlert ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="h-px bg-gray-50"></div>

                    <div className="flex items-center justify-between group">
                        <div className="pr-4">
                            <h4 className="font-bold text-[#3d2b1f] mb-1">Notificaciones Push</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Te avisamos cuando tu temporizador termine o haya nuevas recetas trending.</p>
                        </div>
                        <button
                            onClick={() => setPushAlert(!pushAlert)}
                            className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${pushAlert ? 'bg-[#f48c66]' : 'bg-gray-200'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${pushAlert ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                </div>

                {/* Account Security Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-white/50 p-8">
                    <div className="border-b border-gray-100 pb-4 mb-4">
                        <h2 className="font-bold text-xl text-[#3d2b1f] mb-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#f48c66]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            Seguridad de la Cuenta
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-[#3d2b1f] mb-1">Restablecer Contraseña</h4>
                                <p className="text-sm text-gray-500">Te enviaremos un enlace seguro para crear una nueva clave.</p>
                            </div>
                            <button
                                onClick={handlePasswordReset}
                                disabled={loading}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-[#3d2b1f] font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm shrink-0 whitespace-nowrap"
                            >
                                Enviar Correo
                            </button>
                        </div>

                        <div className="bg-red-50 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-red-100">
                            <div>
                                <h4 className="font-bold text-red-700 mb-1">Eliminar Cuenta</h4>
                                <p className="text-sm text-red-500/80">Esta acción no se puede deshacer. Se borrarán todos tus datos.</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="px-5 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-sm shrink-0 whitespace-nowrap"
                            >
                                {loading ? "Procesando..." : "Eliminar Cuenta"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
