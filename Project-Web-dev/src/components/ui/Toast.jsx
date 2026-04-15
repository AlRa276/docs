import React, { useEffect } from 'react';
import Icon from './Icon';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-[#E6F4EA] border-[#1E8E3E] text-[#1E8E3E]",
        error: "bg-[#FCE8E6] border-[#D93025] text-[#D93025]",
        info: "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
    };

    const icons = {
        success: "check",
        error: "x",
        info: "message" // fallback icon roughly appropriate
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border-l-4 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-300 ${styles[type]} bg-white`}>
            <div className={`p-1 rounded-full ${type === 'success' ? 'bg-[#1E8E3E]/10' : type === 'error' ? 'bg-[#D93025]/10' : 'bg-[#1A73E8]/10'}`}>
                <Icon name={icons[type]} size={20} className="stroke-[3]" />
            </div>
            <div>
                <p className="font-bold text-sm text-[#3d2b1f]">{type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}</p>
                <p className="text-xs font-medium opacity-80">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100"><Icon name="x" size={14} /></button>
        </div>
    );
};

export default Toast;
