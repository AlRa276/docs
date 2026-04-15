import React from 'react';
import Icon from './Icon';

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, icon }) => {
    const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-[#3d2b1f] text-[#FDFBF7] hover:bg-black shadow-lg shadow-[#3d2b1f]/20",
        secondary: "bg-[#FDFBF7] text-[#3d2b1f] border border-[#E8DED5] hover:border-[#3d2b1f]/30 hover:bg-white",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
        ghost: "text-[#3d2b1f]/60 hover:text-[#3d2b1f] hover:bg-[#3d2b1f]/5",
        accent: "bg-[#f48c66] text-white hover:bg-[#e07a54] shadow-lg shadow-[#f48c66]/30",
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
            {icon && <Icon name={icon} size={16} />}
            {children}
        </button>
    );
};

export default Button;
