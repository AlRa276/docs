import React from 'react';
import Icon from '../ui/Icon';

const CommentsList = ({ comments, onDelete }) => {
    return (
        <div className="max-w-3xl space-y-4">
            {comments.length === 0 ? (
                <div className="text-center py-20 text-[#3d2b1f]/40">
                    <Icon name="message" size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay comentarios pendientes.</p>
                </div>
            ) : (
                comments.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-2xl border border-[#E8DED5] shadow-sm flex flex-col sm:flex-row gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center font-bold font-serif shrink-0">{c.userName?.[0]}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-[#3d2b1f]">{c.userName}</p>
                                    <p className="text-xs text-[#3d2b1f]/50 mb-2">en <span className="font-bold text-[#f48c66]">{c.recipeTitle}</span></p>
                                </div>
                                <button onClick={() => onDelete(c)} className="text-red-400 hover:text-red-600 p-2"><Icon name="trash" size={16} /></button>
                            </div>
                            <p className="text-[#3d2b1f]/80 text-sm leading-relaxed bg-[#FDFBF7] p-3 rounded-lg border border-[#E8DED5]">{c.text}</p>
                            {c.photos?.length > 0 && <div className="flex gap-2 mt-3 overflow-x-auto pb-2">{c.photos.map((p, i) => <img key={i} src={p} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />)}</div>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentsList;
