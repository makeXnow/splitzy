import React from 'react';

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
      className={`bg-white p-5 rounded-[1.75rem] transition-all border-2 cursor-pointer ${
        isSelected 
          ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl scale-[1.01]' 
          : 'border-transparent shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className={`font-bold transition-colors ${
          isSelected ? 'text-indigo-600' : 'text-slate-800'
        } pr-4 truncate text-lg`}>
          {item.name}
        </h3>
        <span className="font-black text-slate-900 text-lg whitespace-nowrap">
          {currency}{item.price.toFixed(2)}
        </span>
      </div>
      {assignedPeople.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {assignedPeople.map(p => (
            <span 
              key={p.id} 
              style={{ backgroundColor: p.color }} 
              className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-900 border border-black/5"
            >
              {p.emoji} {p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
