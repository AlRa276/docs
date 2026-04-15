import React, { useState, useEffect, useRef } from 'react';

const CookingMode = ({ recipe, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1+ = Steps, last = Finish
    const [showIngredients, setShowIngredients] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerFinished, setTimerFinished] = useState(false);

    // Audio ref to control playback
    const audioRef = useRef(null);

    const totalSteps = (recipe.steps || []).length;
    const currentStepData = currentStep > 0 && currentStep <= totalSteps ? recipe.steps[currentStep - 1] : null;

    useEffect(() => {
        // Preload audio
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const stopAlarm = () => {
        setTimerFinished(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Reset timer when changing steps
    useEffect(() => {
        setTimerActive(false);
        setTimerFinished(false);
        if (currentStepData?.timer) {
            setTimeLeft(currentStepData.timer);
        } else {
            setTimeLeft(0);
        }
    }, [currentStep, currentStepData]);

    // Local countdown for UI (synced with server start)
    useEffect(() => {
        let interval = null;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            setTimerFinished(true);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.log('Audio play failed', e));
            }
            if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const startTimer = () => {
        if (currentStepData?.timer) {
            setTimeLeft(currentStepData.timer);
            setTimerActive(true);
            setTimerFinished(false);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps + 1) setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const progress = (currentStep / (totalSteps + 1)) * 100;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in duration-300 font-sans">
            {/* Progress Bar (Top) */}
            <div className="w-full bg-gray-100 h-1.5 z-50">
                <div
                    className="bg-[#f48c66] h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full hover:bg-gray-100/80 transition-all text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200"
                        title="Salir del modo cocina"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div>
                        <span className="text-xs font-bold text-[#f48c66] uppercase tracking-wider block mb-0.5">Modo Cocina</span>
                        <h2 className="font-serif font-bold text-lg text-[#3d2b1f] leading-none line-clamp-1 max-w-[200px] md:max-w-md">
                            {recipe.title}
                        </h2>
                    </div>
                </div>

                <button
                    onClick={() => setShowIngredients(!showIngredients)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all shadow-sm flex items-center gap-2 ${showIngredients ? 'bg-[#3d2b1f] text-white border-[#3d2b1f]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                    {showIngredients ? 'Ocultar' : 'Ingredientes'}
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden relative bg-[#fafafa]">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50/60 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                {/* Ingredients Sidebar */}
                <div className={`absolute top-0 right-0 bottom-0 w-full md:w-96 bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-2xl transform transition-transform duration-300 z-30 flex flex-col ${showIngredients ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                        <h3 className="font-serif font-bold text-2xl text-[#3d2b1f]">Ingredientes</h3>
                        <button onClick={() => setShowIngredients(false)} className="md:hidden p-2 bg-gray-100 rounded-full text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <ul className="space-y-4">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-[#f48c66] flex items-center justify-center shrink-0">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#f48c66]"></div>
                                    </div>
                                    <div>
                                        <span className="font-bold text-[#3d2b1f] block text-lg leading-none mb-1">{ing.amount}</span>
                                        <span className="text-gray-600 font-medium">{ing.name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Step Content */}
                <div className={`max-w-5xl mx-auto h-full px-6 flex flex-col justify-center relative z-10 overflow-y-auto ${currentStep > 0 ? 'custom-scrollbar' : 'scrollbar-hide'}`}>

                    {/* Intro Screen */}
                    {currentStep === 0 && (
                        <div className="text-center animate-in slide-in-from-bottom-8 duration-700 py-6 md:py-8">
                            <div className="relative inline-block mb-6 md:mb-8 group">
                                <div className="absolute inset-0 bg-[#f48c66] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-[6px] border-white relative z-10">
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                            </div>

                            <h1 className="font-serif font-bold text-3xl md:text-5xl mb-4 md:mb-6 text-[#3d2b1f] tracking-tight">
                                ¿Listo para cocinar?
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                                Tienes <span className="font-bold text-[#f48c66]">{recipe.steps.length} pasos</span> por delante. Revisa tus ingredientes y ¡vamos a ello!
                            </p>

                            <button
                                onClick={handleNext}
                                className="bg-[#3d2b1f] hover:bg-black text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                            >
                                ¡Empezar Ahora!
                            </button>
                        </div>
                    )}

                    {/* Active Step */}
                    {currentStep > 0 && currentStep <= totalSteps && (
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 animate-in slide-in-from-right duration-500 py-12 max-w-4xl mx-auto w-full">

                            {/* Step Number Badge */}
                            <div className="shrink-0 relative">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-[#3d2b1f] to-[#1a120d] text-white font-serif font-bold text-5xl md:text-6xl shadow-2xl flex items-center justify-center rotate-3 transform transition-transform group-hover:rotate-0">
                                    {currentStep}
                                </div>
                                <div className="absolute -top-3 -right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                                    de {totalSteps}
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left w-full">
                                <h3 className="text-sm font-bold text-[#f48c66] uppercase tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-8 h-px bg-[#f48c66]"></span>
                                    Instrucción
                                </h3>

                                <p className="font-serif font-medium text-2xl md:text-4xl text-[#3d2b1f] mb-10 leading-snug">
                                    {currentStepData.instruction}
                                </p>

                                {/* Timer Section */}
                                {currentStepData.timer && (
                                    <div className={`
                                        p-1 rounded-3xl transition-all duration-300
                                        ${timerActive ? 'bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-gradient-x p-[2px]' : 'bg-transparent'}
                                    `}>
                                        <div className="bg-white rounded-[22px] p-6 shadow-xl border border-gray-100 relative overflow-hidden group">
                                            {!timerActive && !timerFinished && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>}

                                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                                <div className="text-center sm:text-left">
                                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block">Temporizador</span>
                                                    <div className={`font-mono text-4xl md:text-5xl font-bold tracking-tighter ${timerActive ? 'text-[#f48c66]' : 'text-[#3d2b1f]'}`}>
                                                        {formatTime(timeLeft)}
                                                    </div>
                                                </div>

                                                <div className="w-full sm:w-auto flex-1 flex justify-end">
                                                    {!timerActive && !timerFinished && (
                                                        <button
                                                            onClick={startTimer}
                                                            className="w-full sm:w-auto py-3 px-6 bg-[#3d2b1f] hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                                            </svg>
                                                            Iniciar
                                                        </button>
                                                    )}

                                                    {timerActive && (
                                                        <div className="px-6 py-3 bg-orange-50 text-[#f48c66] rounded-xl font-bold flex items-center gap-3 w-full sm:w-auto justify-center">
                                                            <span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                            </span>
                                                            Corriendo...
                                                        </div>
                                                    )}

                                                    {timerFinished && (
                                                        <div className="flex flex-col items-center gap-2 w-full">
                                                            <div className="text-green-600 font-bold flex items-center gap-2 animate-bounce">
                                                                <span>🔔</span> ¡Listo!
                                                            </div>
                                                            <button
                                                                onClick={stopAlarm}
                                                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors text-sm w-full"
                                                            >
                                                                Detener
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Finish Screen */}
                    {currentStep > totalSteps && (
                        <div className="text-center animate-in zoom-in duration-500 py-12">
                            <div className="inline-block p-8 rounded-full bg-green-50 text-green-600 mb-8 border-4 border-green-100 shadow-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-20 h-20">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="font-serif font-bold text-4xl md:text-6xl mb-6 text-[#3d2b1f]">¡Delicioso Trabajo!</h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Has completado la receta de <strong>{recipe.title}</strong> como un verdadero chef.
                                <br />¡Hora de servir y disfrutar!
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-[#5a7a55] hover:bg-[#466042] text-white font-bold py-5 px-16 rounded-full text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                Volver al Menú
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            {currentStep > 0 && currentStep <= totalSteps && (
                <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <button
                            onClick={handlePrev}
                            className="p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-300 text-gray-500 hover:bg-gray-50 transition-all font-bold md:w-40 flex justify-center"
                            aria-label="Paso anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex-1 py-4 rounded-2xl bg-[#3d2b1f] text-white font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <span className="hidden md:inline">Siguiente Instrucción</span>
                            <span className="md:hidden">Siguiente</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CookingMode;
