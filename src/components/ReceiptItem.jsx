
import { getThemeClasses } from '../constants';

export function PersonChip({ person, size = 'sm' }) {
  const themes = getThemeClasses(person.theme);
  
  if (size === 'sm') {
    return (
      <span 
        className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${themes.chip}`}
      >
        {person.name}
      </span>
    );
  }

  // Larger size is essentially what's in PersonCard, but we can have a variant here if needed.
  // For now, ReceiptItem only uses the small one.
  return (
    <span 
      className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${themes.chip}`}
    >
      {person.name}
    </span>
  );
}

export default function ReceiptItem({ 
  item, 
  isSelected, 
  onClick, 
  currency, 
  assignedPeople 
}) {
  return (
    <div 
      onClick={onClick} 
      className={`p-5 rounded-[1.75rem] transition-all border-2 cursor-pointer ${
        isSelected 
          ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-600 dark:border-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-900/20 shadow-xl scale-[1.01]' 
          : 'bg-white dark:bg-slate-900 border-transparent dark:border-slate-800 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className={`font-bold transition-colors ${
          isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
        } pr-4 truncate text-lg`}>
          {item.name}
        </h3>
        <span className="font-black text-slate-900 dark:text-white text-lg whitespace-nowrap">
          {currency}{(item.price || 0).toFixed(2)}
        </span>
      </div>
      {assignedPeople.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {assignedPeople.map(p => (
            <PersonChip key={p.id} person={p} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
