import React from 'react';
import { Plus } from 'lucide-react';
import { VIEW_MODES } from '../constants';

export default function BottomBar({
  viewMode,
  setViewMode,
  unassignedItems,
  currency
}) {
  if (viewMode === VIEW_MODES.RECEIPT) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl border-t border-slate-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" />
      <div className="relative max-w-2xl mx-auto px-4 pb-4 pt-2">
        
        {unassignedItems.length > 0 && (
          <div className="mb-2 flex items-center justify-between px-2">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unassigned</h4>
             <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg animate-pulse">
               {unassignedItems.length} Left
             </span>
          </div>
        )}

        <div className="flex gap-2.5 overflow-x-auto py-2.5 px-1 scrollbar-hide items-start">
          {unassignedItems.map(it => (
            <div 
              key={it.id} 
              onClick={() => { setViewMode(VIEW_MODES.RECEIPT); /* Select item? */ }} 
              className="shrink-0 w-48 h-[68px] p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors"
            >
               <p className="font-bold text-slate-800 text-[10px] truncate leading-none">{it.name}</p>
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-indigo-600 leading-none">
                    {currency}{it.price.toFixed(2)}
                  </span>
                  <div className="bg-slate-50 p-1 rounded-lg text-slate-400">
                    <Plus className="w-3 h-3" />
                  </div>
               </div>
            </div>
          ))}
          {unassignedItems.length === 0 && (
            <div className="flex-1 text-center py-6 text-slate-400 text-[10px] font-black uppercase tracking-widest italic opacity-50">
              Assigned!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
