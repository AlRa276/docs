import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import platoLoginImg from '../assets/plato_login.png';
import hojasImg from '../assets/hojas.png';
import { registro } from '../api/auth';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
  e.preventDefault();
  if (loading) return;

  setError('');
  setLoading(true);

  try {
    const res = await registro({
      correo_electronico: email,
      password,
    });

    console.log(res);
    navigate('/home');

  } catch (err) {
    console.error('Error en registro:', err);
    setError(err.message || 'Ocurrió un error al registrarse.');
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
            // El usuario autenticado será manejado por el routing pero navegamos explícitamente.
            navigate('/home');
        } catch (err) {
            console.error("Error con Google:", err);
            // Manejamos específicamente el cierre del popup
            if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
                setError(''); // Usuario cerró la ventana
            } else {
                setError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
            }
        } finally {
            // Aseguramos que el estado de carga se limpie siempre
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-white p-4 overflow-hidden">
            <div className="w-full max-w-md lg:max-w-none lg:w-[1250px] lg:h-[750px] grid grid-cols-1 lg:grid-cols-2 gap-0">

                {/* SECCIÓN IZQUIERDA: Formulario */}
                <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 z-10 relative">

                    <h1 className="text-4xl md:text-5xl font-bold text-[#3d2b1f] mb-2">
                        Registrarse
                    </h1>
                    <p className="text-gray-500 mb-8 text-lg">
                        ¿Ya tienes cuenta? <Link to="/" className="text-[#0099ff] font-medium hover:underline">Iniciar Sesión</Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        {/* Input Email */}
                        <div className="w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#fafafa] text-gray-700 border border-transparent rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#6b8e66] focus:bg-white transition-all placeholder-gray-400"
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="w-full">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#fafafa] text-gray-700 border border-transparent rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#6b8e66] focus:bg-white transition-all placeholder-gray-400"
                                required
                            />
                        </div>

                        {/* Botón Registrarse */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#6b8e66] hover:bg-[#5a7a55] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#6b8e66]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creando cuenta...
                                </>
                            ) : (
                                'Registrarse'
                            )}
                        </button>

                        {/* Botón Google */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className={`w-full bg-white border border-gray-200 text-[#3d2b1f] font-medium text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {!loading && (
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            {loading ? 'Esperando...' : 'Registrarse con Google'}
                        </button>
                    </form>
                </div>

                {/* SECCIÓN DERECHA: Gráficos (Identico al Login) */}
                <div className="hidden lg:flex relative items-center justify-center h-full">
                    <div className="absolute right-[-18%] w-[100%] aspect-square bg-[#4A644E] rounded-full translate-x-[-18%]"></div>
                    <div className="relative z-10 w-[80%] aspect-square rounded-full flex items-center justify-center">
                        <div className="rounded-full overflow-hidden shadow-2xl border-4 border-white/10 w-full h-full relative z-10">
                            <img
                                src={platoLoginImg}
                                alt="Plato de pasta"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[50%] h-[40%] z-20 pointer-events-none flex items-center justify-center">
                            <img src={hojasImg} alt="Hojas decorativas" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute top-0 left-0 -translate-x-[20%] -translate-y-[20%] w-[50%] h-[40%] z-20 pointer-events-none flex items-center justify-center rotate-180">
                            <img src={hojasImg} alt="Hojas decorativas" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute top-0 right-0 translate-x-[20%] -translate-y-[20%] w-[50%] h-[40%] z-20 pointer-events-none flex items-center justify-center -rotate-90">
                            <img src={hojasImg} alt="Hojas decorativas" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
