import React from 'react';
import { Banknote, HeartHandshake } from 'lucide-react';
import { getThemeClasses } from '../constants';

export default function PersonSummary({ 
  person, 
  items, 
  assignments, 
  currency, 
  personTotal, 
  personExtras,
  unassignedShare,
  peopleCount,
  breakdown,
  adjustment
}) {
  const myItems = items.filter(it => assignments[it.id]?.includes(person.id));
  const unassignedPercentage = Math.round(100 / (peopleCount || 1));
  const themes = getThemeClasses(person.theme);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-xl text-slate-900 dark:text-white leading-none">{person.name}</h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {currency}{personTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {myItems.map(it => (
          <div 
            key={it.id} 
            className={`p-4 rounded-[1.5rem] shadow-sm border ${themes.bg} ${themes.border} flex justify-between items-center transition-all`}
          >
            <div className="min-w-0 pr-2">
              <span className={`font-bold text-sm truncate block ${themes.text}`}>{it.name}</span>
              {assignments[it.id]?.length > 1 && (
                <div className={`text-[10px] font-black uppercase tracking-wider mt-0.5 opacity-60 ${themes.text}`}>
                  Shared {assignments[it.id].length} ways
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className={`text-base font-black ${themes.text}`}>
                {currency}{((it.price || 0) / (assignments[it.id]?.length || 1)).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        
        {unassignedShare > 0 && (
          <div 
            className={`p-4 rounded-[1.5rem] border border-dashed ${themes.bg} ${themes.border} flex justify-between items-center opacity-80`}
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className={`w-4 h-4 opacity-60 ${themes.text}`} />
              <span className={`font-black text-[10px] uppercase tracking-widest ${themes.text}`}>
                {unassignedPercentage}% of Unassigned
              </span>
            </div>
            <span className={`font-black text-sm ${themes.text}`}>
              {currency}{unassignedShare.toFixed(2)}
            </span>
          </div>
        )}

        {/* Individual Extras */}
        {breakdown && Object.entries(breakdown).map(([key, value]) => {
          if (value <= 0) return null;
          return (
            <div 
              key={key}
              className={`p-4 rounded-[1.5rem] border border-dashed ${themes.bg} ${themes.border} flex justify-between items-center opacity-80`}
            >
              <div className="flex items-center gap-2">
                <Banknote className={`w-4 h-4 opacity-60 ${themes.text}`} />
                <span className={`font-black text-[10px] uppercase tracking-widest ${themes.text}`}>
                  {key}
                </span>
              </div>
              <span className={`font-black text-sm ${themes.text}`}>
                {currency}{value.toFixed(2)}
              </span>
            </div>
          );
        })}

        {adjustment > 0 && (
          <div 
            className={`p-4 rounded-[1.5rem] border border-dashed ${themes.bg} ${themes.border} flex justify-between items-center opacity-80`}
          >
            <div className="flex items-center gap-2">
              <Banknote className={`w-4 h-4 opacity-60 ${themes.text}`} />
              <span className={`font-black text-[10px] uppercase tracking-widest ${themes.text}`}>
                Other Adjustments
              </span>
            </div>
            <span className={`font-black text-sm ${themes.text}`}>
              {currency}{adjustment.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
