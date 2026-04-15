import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import platoLoginImg from '../assets/plato_login.png';
import hojasImg from '../assets/hojas.png';
import { login } from '../api/auth';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
  e.preventDefault();
  if (loading) return;

  setError('');
  setMessage('');
  setLoading(true);

  try {
    const res = await login(email, password);
    console.log(res);

    if (res.token) {
      localStorage.setItem('token', res.token); // Guarda el token
      navigate('/home');
    }

    } catch (err) {
        console.error('Error en login:', err);
        setError('Correo o contraseña incorrectos.');
    } finally {
        setLoading(false);
    }
};

    const handleGoogleLogin = async () => {
        if (loading) return;
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/home');
        } catch (err) {
            console.error("Error con Google:", err);
            if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
                setError('');
            } else {
                setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Por favor, ingresa tu correo para restablecer la contraseña.');
            return;
        }
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Se ha enviado un correo para restablecer tu contraseña.');
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No existe una cuenta con este correo.');
            } else {
                setError('Error al enviar el correo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-white font-sans overflow-hidden">

            {/* SECCIÓN IZQUIERDA: Formulario */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16 relative z-10 bg-white">

                {/* 1. Header Superior (Logo) */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <img
                        src="/favicon.svg"
                        alt="Ñam Ñam Logo"
                        className="w-10 h-10 drop-shadow-md"
                    />
                    <span className="text-xl font-serif font-bold text-[#3d2b1f]">Ñam Ñam</span>
                </div>

                {/* 2. Contenido Central (Formulario) */}
                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">

                    <div className="mb-6 lg:mb-8 text-center lg:text-left">
                        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#3d2b1f] mb-2 leading-tight">
                            Bienvenido <br className="hidden lg:block" /> de vuelta.
                        </h1>
                        <p className="text-gray-500 text-base">
                            Ingresa tus datos para continuar cocinando.
                        </p>
                    </div>

                    {/* Mensajes de Alerta (Compactos) */}
                    {(error || message) && (
                        <div className={`p-3 rounded-xl mb-4 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border ${error ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                                <path fillRule="evenodd" d={error ? "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" : "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"} clipRule="evenodd" />
                            </svg>
                            {error || message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">Correo</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-[#f48c66] focus:border-[#f48c66] block p-3.5 pl-11 transition-all placeholder-gray-400 focus:bg-white"
                                        placeholder="ejemplo@correo.com"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1 uppercase tracking-wider">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-[#f48c66] focus:border-[#f48c66] block p-3.5 pl-11 transition-all placeholder-gray-400 focus:bg-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-1.5">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-xs font-bold text-[#f48c66] hover:text-[#e07b55] hover:underline transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-[#3d2b1f] hover:bg-black focus:ring-4 focus:outline-none focus:ring-[#3d2b1f]/30 font-bold rounded-xl text-base px-5 py-3.5 text-center shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>

                        <div className="relative py-1">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-400 font-medium">O continúa con</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 rounded-xl text-base px-5 py-3.5 transition-all active:scale-[0.99]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        ¿Nuevo aquí? <Link to="/register" className="font-bold text-[#f48c66] hover:underline">Crea una cuenta</Link>
                    </p>
                </div>

                {/* 3. Footer simple */}
                <div className="text-center lg:text-left text-xs text-gray-300 font-medium flex-shrink-0">
                    &copy; 2024 Ñam Ñam Inc.
                </div>
            </div>

            {/* SECCIÓN DERECHA: Arte/Visual (Fijo sin scroll) */}
            <div className="hidden lg:block w-1/2 h-full relative bg-[#2a1e16] overflow-hidden">
                {/* Visuals - Se mantienen igual pero con h-full garantizado */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f48c66]/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4A644E]/20 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[80%] max-w-[500px] aspect-square">
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                        <div className="absolute inset-[10%] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

                        <div className="absolute inset-0 flex items-center justify-center z-10 animate-[float_6s_ease-in-out_infinite]">
                            <div className="w-[70%] h-[70%] rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-[#3d2b1f] relative overflow-hidden group border-[6px] border-white/5">
                                <img
                                    src={platoLoginImg}
                                    alt="Plato Gourmet"
                                    className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Elementos Satélite */}
                        <div className="absolute top-[5%] left-[5%] w-[15%] aspect-square animate-[float_5s_ease-in-out_infinite_delay-1000] blur-[1px]">
                            <img src={hojasImg} alt="" className="w-full h-full object-contain rotate-45 opacity-80" />
                        </div>
                        <div className="absolute bottom-[10%] right-[10%] w-[20%] aspect-square animate-[float_7s_ease-in-out_infinite_delay-200] z-20">
                            <img src={hojasImg} alt="" className="w-full h-full object-contain -rotate-12 drop-shadow-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;