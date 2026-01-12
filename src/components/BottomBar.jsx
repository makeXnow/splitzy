import React from 'react';
import { Plus } from 'lucide-react';

export default function BottomBar({ unassignedItems, currency }) {
  const unclaimedTotal = unassignedItems.reduce((sum, item) => sum + item.price, 0);

  if (unassignedItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-2xl mx-auto flex justify-center">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
              Unassigned
            </span>
            <span className="text-white font-black text-lg leading-none">
              {currency}{unclaimedTotal.toFixed(2)}
            </span>
          </div>
          
          <div className="h-8 w-px bg-white/10" />
          
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {unassignedItems.slice(0, 3).map((item, i) => (
                <div 
                  key={item.id}
                  className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-white"
                >
                  {i === 2 && unassignedItems.length > 3 ? `+${unassignedItems.length - 2}` : item.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <span className="text-indigo-400 text-xs font-black uppercase tracking-wider">
              {unassignedItems.length} {unassignedItems.length === 1 ? 'Item' : 'Items'} Left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
