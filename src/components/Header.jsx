import { FileText, Users, RefreshCcw, ArrowLeft, Plus } from 'lucide-react';
import { VIEW_MODES } from '../constants';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onUploadClick, 
  isScanning, 
  hasItems,
  children, 
  isAddingPerson,
  startAdding,
  people
}) {

  return (
    <div className={`${(hasItems && !isScanning) ? 'relative' : 'absolute'} top-0 left-0 right-0 z-40 overflow-visible`}>
      <div className={`absolute inset-0 backdrop-blur-xl border-b transition-colors duration-500 ${
        isScanning 
          ? 'bg-black/20 dark:bg-black/40 border-white/10' 
          : (hasItems ? 'bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-800/50' : 'bg-white/40 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/50')
      }`} />
      
      <div className="relative max-w-2xl mx-auto overflow-visible z-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 overflow-hidden" style={{ borderRadius: '22.5%' }}>
               <img src={`${import.meta.env.BASE_URL}icon.png`} alt="Splitzy Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${isScanning || !hasItems ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Splitzy</h1>
          </div>
          
          {hasItems && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
              <button 
                onClick={() => setViewMode(viewMode === VIEW_MODES.RECEIPT ? VIEW_MODES.PEOPLE : VIEW_MODES.RECEIPT)}
                className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl mr-1 cursor-pointer active:scale-95 transition-all"
              >
                <div 
                  className={`p-2.5 rounded-xl transition-all ${viewMode === VIEW_MODES.RECEIPT ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400'}`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div 
                  className={`p-2.5 rounded-xl transition-all ${viewMode === VIEW_MODES.PEOPLE ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400'}`}
                >
                  <Users className="w-5 h-5" />
                </div>
              </button>

              <button 
                onClick={onUploadClick} 
                className="p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* People List Grid */}
        {(hasItems || isScanning) && (
          <div className="px-4 pb-4 pt-[10px]">
            <div className="flex flex-wrap gap-2.5 items-center">
              {children}

              <button 
                onClick={startAdding} 
                className={`h-[72px] flex-1 max-w-[72px] min-w-[36px] flex items-center justify-center rounded-2xl border-2 border-dashed transition-all active:scale-90 ${
                  isScanning 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Plus size={24} strokeWidth={3} className="shrink-0" />
              </button>

              {/* Add People Hint */}
              {people.length === 0 && !isAddingPerson && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700 shrink-0 animate-horizontal-bounce ml-2">
                  <ArrowLeft className={`w-4 h-4 ${isScanning ? 'text-white' : 'text-indigo-500'}`} />
                  <p className={`text-[11px] font-black uppercase tracking-[0.2em] italic whitespace-nowrap ${isScanning ? 'text-white' : 'text-indigo-500'}`}>
                    Add Friends
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
