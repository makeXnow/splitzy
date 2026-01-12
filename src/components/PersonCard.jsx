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
  const cardBase = "relative flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border-2 shrink-0 w-fit min-w-[64px] h-[96px]";

  if (isEditing) {
    return (
      <form 
        onSubmit={(e) => { e.preventDefault(); onFinalize(); }} 
        className={`${cardBase} border-4 border-indigo-500 shadow-xl scale-105 z-20`}
        style={{ backgroundColor: person.color }}
      >
        <div className="text-3xl leading-none py-1">
          {person.emoji}
        </div>
        <div className="min-w-0 flex flex-col items-center px-2">
          <div className="grid items-center">
            <span className="col-start-1 row-start-1 invisible font-black text-xs leading-tight whitespace-pre text-center text-slate-900 px-1">
              {pendingName}
            </span>
            <input 
              ref={inputRef} 
              type="text" 
              value={pendingName} 
              onChange={(e) => setPendingName(e.target.value)} 
              onBlur={onFinalize} 
              className="col-start-1 row-start-1 w-0 min-w-full bg-transparent border-none p-0 text-xs font-black focus:ring-0 outline-none leading-tight text-center text-slate-900" 
            />
          </div>
          <p className="text-[9px] text-slate-900/60 font-black leading-none mt-1 text-center">
            {currency}{total.toFixed(2)}
          </p>
        </div>
      </form>
    );
  }

  return (
    <div 
      {...longPressProps}
      onClick={() => onPress(person.id)}
      className={`${cardBase} ${
        isAssigned 
          ? 'shadow-lg scale-105 z-10 border-4 border-black/40' 
          : 'shadow-sm border-black/5'
      } active:scale-95 group`}
      style={{ 
        backgroundColor: person.color,
      }}
    >
      
      <div className="text-3xl leading-none py-1 transition-transform duration-300 relative">
        {person.emoji}
      </div>
      <div className="min-w-0 flex flex-col items-center relative px-2">
        <p className="font-black text-xs leading-tight text-center text-slate-900 whitespace-nowrap">{person.name}</p>
        <p className="text-[9px] text-slate-900/60 font-black leading-none mt-1 text-center">
          {currency}{total.toFixed(2)}
        </p>
      </div>
      {isMenuOpen && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center gap-2 z-20 animate-in fade-in zoom-in duration-200">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(person); }} 
              className="p-1.5 text-indigo-500 bg-indigo-50 rounded-lg hover:scale-110 transition-transform"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(person.id); }} 
              className="p-1.5 text-rose-500 bg-rose-50 rounded-lg hover:scale-110 transition-transform"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onCloseMenu(); }} 
            className="p-1 text-slate-400 bg-slate-50 rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
