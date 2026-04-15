import React from 'react';

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#E8DED5] ${className}`}>
        {children}
    </div>
);

export default Card;
