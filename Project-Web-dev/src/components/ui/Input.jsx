import React from 'react';

const Input = ({ label, ...props }) => (
    <div className="w-full space-y-1.5">
        {label && <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3d2b1f]/40">{label}</label>}
        <input {...props} className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E8DED5] rounded-xl text-[#3d2b1f] font-medium placeholder:text-[#3d2b1f]/20 focus:outline-none focus:border-[#f48c66] focus:ring-1 focus:ring-[#f48c66] transition-all" />
    </div>
);

export default Input;
