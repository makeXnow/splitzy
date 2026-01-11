import React from 'react';
import { Pencil, Trash2, X } from 'lucide-react';

export default function PersonCard({ 
  person, 
  isAssigned, 
  isEditing, 
  isMenuOpen,
  total,
  currency,
  onPress,
  onEdit,
  onDelete,
  onCloseMenu,
  pendingName,
  setPendingName,
  onFinalize,
  inputRef,
  longPressProps
}) {
  const cardBase = "relative flex items-center gap-3 p-3 pr-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 min-w-[140px] min-h-[68px]";

  if (isEditing) {
    return (
      <form 
        onSubmit={(e) => { e.preventDefault(); onFinalize(); }} 
        className={`${cardBase} bg-white border-indigo-500 shrink-0`}
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0" 
          style={{ backgroundColor: person.color }}
        >
          {person.emoji}
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <input 
            ref={inputRef} 
            type="text" 
            value={pendingName} 
            onChange={(e) => setPendingName(e.target.value)} 
            onBlur={onFinalize} 
            className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none leading-tight" 
          />
          <p className="text-[10px] text-slate-400 font-black leading-none mt-1">
            {currency}{total.toFixed(2)}
          </p>
        </div>
      </form>
    );
  }

  return (
    <div 
      {...longPressProps}
      className={`${cardBase} ${
        isAssigned 
          ? 'bg-white shadow-lg scale-[1.05] z-10' 
          : 'bg-white shadow-sm border-transparent'
      } active:scale-95`}
      style={{ borderColor: isAssigned ? person.border : 'transparent' }}
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0" 
        style={{ backgroundColor: person.color }}
      >
        {person.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm leading-tight break-words">{person.name}</p>
        <p className="text-[10px] text-slate-400 font-black leading-none mt-1">
          {currency}{total.toFixed(2)}
        </p>
      </div>
      {isMenuOpen && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex items-center justify-around z-20 animate-in fade-in zoom-in duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(person); }} 
            className="p-2 text-indigo-500 bg-indigo-50 rounded-full hover:scale-110 transition-transform"
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(person.id); }} 
            className="p-2 text-rose-500 bg-rose-50 rounded-full hover:scale-110 transition-transform"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onCloseMenu(); }} 
            className="p-2 text-slate-400 bg-slate-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
