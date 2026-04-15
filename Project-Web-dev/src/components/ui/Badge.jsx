import React from 'react';

const Badge = ({ children, type = 'neutral' }) => {
    const styles = {
        neutral: "bg-[#F3F0EC] text-[#3d2b1f]/60",
        success: "bg-[#E6F4EA] text-[#1E8E3E]",
        accent: "bg-[#FFF0EB] text-[#f48c66]",
        outline: "border border-[#E8DED5] text-[#3d2b1f]/40"
    };
    return <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${styles[type]}`}>{children}</span>;
};

export default Badge;
