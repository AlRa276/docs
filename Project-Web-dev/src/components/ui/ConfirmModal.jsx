import React, { useEffect } from 'react';
import Button from './Button';
import Icon from './Icon';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel}></div>
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-[#E8DED5]">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-[#E6F4EA] text-[#1E8E3E]'}`}>
                    <Icon name={type === 'danger' ? 'trash' : 'check'} size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#3d2b1f] mb-2">{title}</h3>
                <p className="text-sm text-[#3d2b1f]/60 mb-8 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onCancel} className="flex-1">{cancelText}</Button>
                    <Button variant={type} onClick={onConfirm} className="flex-1">{confirmText}</Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
