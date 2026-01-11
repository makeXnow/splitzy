import React from 'react';
import { FileText, Users, Loader2, Plus, ArrowLeft } from 'lucide-react';
import { VIEW_MODES } from '../constants';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onUploadClick, 
  isScanning, 
  hasItems,
  children, // This will now be the people list
  isAddingPerson,
  startAdding,
  addPreview,
  pendingName,
  setPendingName,
  onFinalizePerson,
  personInputRef,
  currency,
  peopleCount
}) {
  const cardBase = "relative flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border-2 shrink-0 w-fit min-w-[64px] h-[96px]";

  return (
    <div className="sticky top-0 z-40 overflow-visible">
      {/* Shared background layer for both rows */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50" />
      
      <div className="relative max-w-2xl mx-auto overflow-visible z-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 shadow-lg shadow-indigo-100 overflow-hidden" style={{ borderRadius: '22.5%' }}>
               <img src="/icon.png" alt="Splitzy Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Splitzy</h1>
          </div>
          
          {(hasItems || isScanning) && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
              <button 
                onClick={() => setViewMode(viewMode === VIEW_MODES.RECEIPT ? VIEW_MODES.PEOPLE : VIEW_MODES.RECEIPT)}
                className="flex items-center bg-slate-100 p-1 rounded-2xl mr-1 cursor-pointer active:scale-95 transition-all"
              >
                <div 
                  className={`p-2.5 rounded-xl transition-all ${viewMode === VIEW_MODES.RECEIPT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div 
                  className={`p-2.5 rounded-xl transition-all ${viewMode === VIEW_MODES.PEOPLE ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <Users className="w-5 h-5" />
                </div>
              </button>
              <button 
                onClick={onUploadClick} 
                disabled={isScanning} 
                className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* People List Row - Only in Receipt mode */}
        {viewMode === VIEW_MODES.RECEIPT && (hasItems || isScanning) && (
          <div className="px-4 pb-4 overflow-x-auto scrollbar-hide -mx-4 pt-[10px]">
            <div className="flex gap-2.5 items-center px-4">
              {children}
              
              {isAddingPerson && (
                <form 
                  onSubmit={(e) => { e.preventDefault(); onFinalizePerson(); }} 
                  className={`${cardBase} border-dashed border-slate-300 animate-grow-width mx-2 scale-110 z-20`}
                  style={{ backgroundColor: addPreview?.color }}
                >
                  <div className="animate-contents-in flex flex-col items-center justify-center gap-1">
                    <div className="text-3xl leading-none py-1">
                      {addPreview?.emoji}
                    </div>
                    <div className="min-w-0 flex flex-col items-center px-2">
                      <div className="grid items-center">
                        <span className="col-start-1 row-start-1 invisible font-black text-xs leading-tight whitespace-pre text-center text-slate-900 px-1">
                          {pendingName}
                        </span>
                        <input 
                          ref={personInputRef} 
                          type="text" 
                          value={pendingName} 
                          onChange={(e) => setPendingName(e.target.value)} 
                          onBlur={onFinalizePerson} 
                          placeholder="Name" 
                          className="col-start-1 row-start-1 w-0 min-w-full bg-transparent border-none p-0 text-xs font-black placeholder:text-slate-900/40 focus:ring-0 outline-none leading-tight text-center text-slate-900" 
                        />
                      </div>
                      <p className="text-[9px] text-slate-900/60 font-black leading-none mt-1">
                        {currency}0.00
                      </p>
                    </div>
                  </div>
                </form>
              )}

              <button 
                onClick={startAdding} 
                className="w-[96px] h-[96px] flex items-center justify-center rounded-2xl bg-white border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 transition-all shrink-0 active:scale-90"
              >
                <Plus size={32} strokeWidth={3} />
              </button>

              {/* Add People Hint */}
              {peopleCount === 0 && !isAddingPerson && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700 shrink-0 animate-horizontal-bounce">
                  <ArrowLeft className="w-4 h-4 text-indigo-500" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 italic whitespace-nowrap">
                    Add People
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
