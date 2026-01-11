import React from 'react';
import { Info } from 'lucide-react';

export default function PersonSummary({ 
  person, 
  items, 
  assignments, 
  currency, 
  personTotal, 
  personExtras 
}) {
  const myItems = items.filter(it => assignments[it.id]?.includes(person.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div 
            style={{ backgroundColor: person.color }} 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-black/5"
          >
            {person.emoji}
          </div>
          <h2 className="font-black text-xl text-slate-900 leading-none">{person.name}</h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">
            {currency}{personTotal.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {myItems.map(it => (
          <div 
            key={it.id} 
            style={{ backgroundColor: person.color }}
            className="p-4 rounded-3xl shadow-sm border border-black/5 flex justify-between items-center"
          >
            <span className="font-bold text-slate-800 text-sm truncate pr-2">{it.name}</span>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-slate-900">
                {currency}{(it.price / (assignments[it.id]?.length || 1)).toFixed(2)}
              </div>
              {assignments[it.id]?.length > 1 && (
                <div className="text-[9px] font-bold text-black/40 uppercase">
                  Shared {assignments[it.id].length} ways
                </div>
              )}
            </div>
          </div>
        ))}
        <div 
          style={{ backgroundColor: `${person.color}33` }} 
          className="p-4 rounded-3xl border border-black/5 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span className="font-black text-slate-600 text-[10px] uppercase tracking-widest">
              Tax, Tip & Fees
            </span>
          </div>
          <span className="font-black text-slate-700 text-sm">
            {currency}{personExtras.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
