import React from 'react';
import { Plus } from 'lucide-react';
import { VIEW_MODES } from '../constants';

export default function BottomBar({
  viewMode,
  setViewMode,
  unassignedItems,
  currency,
  children,
  isAddingPerson,
  startAdding,
  addPreview,
  pendingName,
  setPendingName,
  onFinalizePerson,
  personInputRef
}) {
  const cardBase = "relative flex items-center gap-3 p-3 pr-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 min-w-[140px] min-h-[68px]";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl border-t border-slate-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" />
      <div className="relative max-w-2xl mx-auto px-4 pb-4 pt-2">
        
        {viewMode === VIEW_MODES.PEOPLE && unassignedItems.length > 0 && (
          <div className="mb-2 flex items-center justify-between px-2">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unassigned</h4>
             <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg animate-pulse">
               {unassignedItems.length} Left
             </span>
          </div>
        )}

        <div className="flex gap-2.5 overflow-x-auto py-2.5 px-1 scrollbar-hide items-start">
          {viewMode === VIEW_MODES.RECEIPT ? (
            <>
              {children}
              {isAddingPerson ? (
                <form 
                  onSubmit={(e) => { e.preventDefault(); onFinalizePerson(); }} 
                  className={`${cardBase} bg-white border-dashed border-slate-300 w-fit animate-bouncy shrink-0`}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0" 
                    style={{ backgroundColor: addPreview?.color }}
                  >
                    {addPreview?.emoji}
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <div className="grid items-center min-w-0">
                      <span className="col-start-1 row-start-1 invisible font-bold text-sm leading-tight pr-1 whitespace-pre-wrap">
                        {pendingName || "Name"}
                      </span>
                      <input 
                        ref={personInputRef} 
                        type="text" 
                        value={pendingName} 
                        onChange={(e) => setPendingName(e.target.value)} 
                        onBlur={onFinalizePerson} 
                        placeholder="Name" 
                        className="col-start-1 row-start-1 w-0 min-w-full bg-transparent border-none p-0 text-sm font-bold placeholder:text-slate-300 focus:ring-0 outline-none leading-tight" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-black leading-none mt-1">
                      {currency}0.00
                    </p>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={startAdding} 
                  className="w-[68px] h-[68px] flex items-center justify-center rounded-2xl bg-white border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 transition-all shrink-0 active:scale-90"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
