
import { Pencil, Trash2, X } from 'lucide-react';
import { getThemeClasses } from '../constants';

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
  const themes = getThemeClasses(person.theme);
  const cardBase = "relative flex flex-col items-center justify-center gap-0.5 p-3 rounded-2xl cursor-pointer transition-all duration-300 border-2 shrink-0 h-[72px] shadow-sm";

  if (isEditing) {
    return (
      <form 
        onSubmit={(e) => { e.preventDefault(); onFinalize(); }} 
        className={`${cardBase} ${themes.bg} border-indigo-500 dark:border-indigo-400 shadow-lg z-20 w-fit`}
        style={{ minWidth: '72px' }}
      >
        <div className="min-w-0 flex flex-col items-center w-full px-1">
          <div className="grid items-center" style={{ minWidth: '24px' }}>
            <span className={`col-start-1 row-start-1 invisible text-base font-black whitespace-pre px-1 ${themes.text}`}>
              {pendingName}
            </span>
            <input 
              ref={inputRef} 
              type="text" 
              value={pendingName} 
              onChange={(e) => setPendingName(e.target.value.slice(0, 20))} 
              onBlur={onFinalize} 
              className={`col-start-1 row-start-1 w-0 min-w-full bg-transparent border-none p-0 text-base font-black focus:ring-0 outline-none leading-tight text-center ${themes.text}`} 
            />
          </div>
          <p className={`text-[10px] font-black leading-none mt-1 opacity-60 text-center ${themes.text}`}>
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
      className={`${cardBase} ${themes.bg} ${
        isAssigned 
          ? `z-10 ${themes.activeBorder} border-4` 
          : `${themes.border} hover:scale-[1.02]`
      } active:scale-95 group w-fit`}
      style={{ minWidth: '72px' }}
    >
      <div className="min-w-0 flex flex-col items-center w-full px-1">
        <p className={`font-black text-base leading-tight text-center w-fit px-1 ${themes.text}`}>{person.name}</p>
        <p className={`text-[10px] font-black leading-none mt-1 text-center opacity-60 ${themes.text}`}>
          {currency}{total.toFixed(2)}
        </p>
      </div>

      {isMenuOpen && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 rounded-2xl flex items-center justify-center gap-2 z-20 animate-in fade-in zoom-in duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(person); }} 
            className="p-1.5 text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg hover:scale-110 transition-transform"
          >
            <Pencil size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(person.id); }} 
            className="p-1.5 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/40 rounded-lg hover:scale-110 transition-transform"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onCloseMenu(); }} 
            className="p-1 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
