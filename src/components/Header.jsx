import React from 'react';
import { Receipt as ReceiptIcon, FileText, Users, Loader2, Plus } from 'lucide-react';
import { VIEW_MODES } from '../constants';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onUploadClick, 
  isScanning, 
  hasItems 
}) {
  return (
    <div className="bg-white border-b p-4 sticky top-0 z-40 shadow-sm">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-indigo-100">
             <ReceiptIcon className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight hidden sm:block">Splitzy</h1>
        </div>
        
        {(hasItems || isScanning) && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl mr-1">
              <button 
                onClick={() => setViewMode(VIEW_MODES.RECEIPT)} 
                className={`p-2.5 rounded-xl transition-all ${viewMode === VIEW_MODES.RECEIPT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <FileText className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode(VIEW_MODES.PEOPLE)} 
                className={`p-2.5 rounded-xl transition-all ${viewMode === VIEW_MODES.PEOPLE ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
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
    </div>
  );
}
