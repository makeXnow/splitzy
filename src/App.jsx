import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Plus, PieChart } from 'lucide-react';

// Services & Constants
import { callOpenAI as callAI } from './api/openai';
import { PRESETS, VIEW_MODES } from './constants';

// Hooks
import { useLongPress } from './hooks/useLongPress';
import { useSplitLogic } from './hooks/useSplitLogic';

// Components
import Header from './components/Header';
import ReceiptItem from './components/ReceiptItem';
import PersonCard from './components/PersonCard';
import PersonSummary from './components/PersonSummary';
import BottomBar from './components/BottomBar';

export default function App() {
  // --- UI State ---
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.RECEIPT);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  // --- Data State ---
  const [items, setItems] = useState([]);
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [currency, setCurrency] = useState('$');
  const [people, setPeople] = useState([]);
  const [assignments, setAssignments] = useState({});

  // --- Form State ---
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [pendingName, setPendingName] = useState('');
  const [addPreview, setAddPreview] = useState(null);

  // --- Refs ---
  const uploadInputRef = useRef(null);
  const personInputRef = useRef(null);

  // --- Logic Hook ---
  const {
    unassignedItems,
    unclaimedTotal,
    personTotals
  } = useSplitLogic(items, people, assignments, receiptTotal);

  // --- Auto-focus effect ---
  useEffect(() => {
    if ((isAddingPerson || editingPersonId) && personInputRef.current) {
      personInputRef.current.focus();
    }
  }, [isAddingPerson, editingPersonId]);

  // --- Handlers ---
  const processImage = async (base64, mimeType = 'image/jpeg') => {
    setIsScanning(true);
    setError(null);
    setSelectedItemId(null);

    try {
      const prompt = "Analyze this receipt and extract the items, prices, total, and currency symbol. Return as JSON.";
      const result = await callAI(prompt, base64, mimeType);
      
      if (result.items) {
        setItems(result.items.map((it, idx) => ({ 
          ...it, 
          id: `item-${Date.now()}-${idx}` 
        })));
        setReceiptTotal(result.total || 0);
        setCurrency(result.currencySymbol || '$');
        setAssignments({});
      }
    } catch (err) {
      setError(err.message || "AI failed to read receipt.");
    } finally {
      setIsScanning(false);
    }
  };

  const convertHeicToJpeg = async (file) => {
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:convertHeicToJpeg:start',message:'Starting dynamic import',data:{fileName:file.name,fileSize:file.size},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    
    // Dynamic import - this is the key to making heic2any work with Vite
    const heic2any = (await import('heic2any')).default;
    
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:convertHeicToJpeg:imported',message:'heic2any imported',data:{heic2anyType:typeof heic2any},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:convertHeicToJpeg:converted',message:'Conversion complete',data:{blobType:typeof blob,isArray:Array.isArray(blob)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    return Array.isArray(blob) ? blob[0] : blob;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // #region agent log
    fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleFileChange:start',message:'File selected',data:{fileName:file.name,fileType:file.type,fileSize:file.size},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    setIsScanning(true);
    setError(null);
    e.target.value = '';

    try {
      let fileToProcess = file;
      const fileName = file.name.toLowerCase();
      const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
                     file.type === 'image/heic' || file.type === 'image/heif';

      // #region agent log
      fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleFileChange:detection',message:'HEIC detection result',data:{isHeic,fileName,fileType:file.type},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion

      if (isHeic) {
        try {
          fileToProcess = await convertHeicToJpeg(file);
          // #region agent log
          fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleFileChange:conversionSuccess',message:'HEIC conversion succeeded',data:{convertedSize:fileToProcess.size,convertedType:fileToProcess.type},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
          // #endregion
        } catch (conversionError) {
          // #region agent log
          fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleFileChange:conversionError',message:'HEIC conversion failed',data:{error:conversionError.message,stack:conversionError.stack},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
          // #endregion
          setError("Could not convert HEIC. Please convert to JPEG first.");
          setIsScanning(false);
          return;
        }
      }

      // Read the file as base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(fileToProcess);
      });

      // #region agent log
      fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleFileChange:fileRead',message:'File read complete',data:{base64Length:base64.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion

      const base64Data = base64.split(',')[1];
      const mimeType = isHeic ? 'image/jpeg' : base64.split(',')[0].split(':')[1].split(';')[0];
      
      await processImage(base64Data, mimeType);
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7251/ingest/31b76d65-8992-46f3-8685-3063626d4296',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleFileChange:outerError',message:'Outer catch triggered',data:{error:err.message,stack:err.stack},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      setError(err.message || "Failed to process image.");
      setIsScanning(false);
    }
  };

  const startAdding = () => {
    const usedEmoji = people.map(p => p.emoji);
    const pool = PRESETS.filter(p => !usedEmoji.includes(p.emoji));
    const randomPreset = (pool.length ? pool : PRESETS)[
      Math.floor(Math.random() * (pool.length || PRESETS.length))
    ];
    setAddPreview(randomPreset);
    setIsAddingPerson(true);
    setMenuId(null);
  };

  const startEditing = (p) => {
    setEditingPersonId(p.id);
    setPendingName(p.name);
    setAddPreview(p);
    setMenuId(null);
  };

  const handleFinalizePerson = () => {
    if (pendingName.trim()) {
      if (editingPersonId) {
        setPeople(people.map(p => 
          p.id === editingPersonId ? { ...p, name: pendingName.trim() } : p
        ));
      } else if (addPreview) {
        setPeople([...people, { 
          id: crypto.randomUUID(), 
          name: pendingName.trim(), 
          ...addPreview 
        }]);
      }
    }
    setPendingName('');
    setAddPreview(null);
    setIsAddingPerson(false);
    setEditingPersonId(null);
  };

  const toggleAssignment = useCallback((itemId, personId) => {
    if (!itemId) return;
    setAssignments(prev => {
      const current = prev[itemId] || [];
      const isAssigned = current.includes(personId);
      return {
        ...prev,
        [itemId]: isAssigned 
          ? current.filter(id => id !== personId)
          : [...current, personId]
      };
    });
  }, []);

  const deletePerson = (pid) => {
    setPeople(people.filter(p => p.id !== pid));
    setAssignments(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(itemId => {
        next[itemId] = next[itemId].filter(id => id !== pid);
      });
      return next;
    });
    setMenuId(null);
  };

  // --- Long Press Hook ---
  const longPress = useLongPress((id) => setMenuId(id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-32 font-sans select-none overflow-x-hidden">
      <Header 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onUploadClick={() => uploadInputRef.current?.click()}
        isScanning={isScanning}
        hasItems={items.length > 0}
      />
      
      <input 
        type="file" 
        ref={uploadInputRef} 
        className="hidden" 
        accept="image/*,.heic,.heif" 
        onChange={handleFileChange} 
      />

      <main className="p-4 max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)} className="p-1 hover:bg-rose-100 rounded-lg">
              <Plus className="w-4 h-4 rotate-45" />
            </button>
          </div>
        )}

        {items.length === 0 && !isScanning && (
          <div className="py-24 text-center">
            <button 
              onClick={() => uploadInputRef.current?.click()}
              className="group inline-flex flex-col items-center transition-all active:scale-95"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600 text-white rounded-[2rem] mb-6 shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                <Plus className="w-10 h-10" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add a receipt to start</h2>
            </button>
          </div>
        )}

        {isScanning && (
          <div className="py-24 text-center animate-pulse">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Processing receipt...</p>
          </div>
        )}

        {viewMode === VIEW_MODES.RECEIPT && items.length > 0 && (
          <div className="space-y-3">
            {items.map(item => (
              <ReceiptItem 
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
                onClick={() => setSelectedItemId(prev => prev === item.id ? null : item.id)}
                currency={currency}
                assignedPeople={people.filter(p => assignments[item.id]?.includes(p.id))}
              />
            ))}

            <div className="bg-slate-900 p-5 rounded-[1.75rem] border-2 border-slate-800 shadow-xl text-white cursor-default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 text-white shrink-0">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Session Summary</p>
                    <h3 className="text-lg font-black leading-tight">Final Balance</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black leading-none">{currency}{receiptTotal.toFixed(2)}</p>
                  <p className={`text-[11px] font-black mt-1 ${unclaimedTotal > 0 ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    {unclaimedTotal > 0 ? `${currency}${unclaimedTotal.toFixed(2)} unassigned` : 'Perfectly Split! 🎉'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === VIEW_MODES.PEOPLE && items.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {people.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm font-medium italic">
                Add your friends below to see their breakdowns.
              </div>
            ) : (
              people.map(person => (
                <PersonSummary 
                  key={person.id}
                  person={person}
                  items={items}
                  assignments={assignments}
                  currency={currency}
                  personTotal={personTotals[person.id].total}
                  personExtras={personTotals[person.id].extras}
                />
              ))
            )}
          </div>
        )}
      </main>

      {(items.length > 0 || isScanning) && (
        <BottomBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          unassignedItems={unassignedItems}
          currency={currency}
          isAddingPerson={isAddingPerson}
          startAdding={startAdding}
          addPreview={addPreview}
          pendingName={pendingName}
          setPendingName={setPendingName}
          onFinalizePerson={handleFinalizePerson}
          personInputRef={personInputRef}
        >
          {people.map(p => (
            <PersonCard 
              key={p.id}
              person={p}
              isAssigned={selectedItemId && (assignments[selectedItemId] || []).includes(p.id)}
              isEditing={editingPersonId === p.id}
              isMenuOpen={menuId === p.id}
              total={personTotals[p.id].total}
              currency={currency}
              onPress={(id) => {
                if (menuId) setMenuId(null);
                else if (selectedItemId) toggleAssignment(selectedItemId, id);
              }}
              onEdit={startEditing}
              onDelete={deletePerson}
              onCloseMenu={() => setMenuId(null)}
              pendingName={pendingName}
              setPendingName={setPendingName}
              onFinalize={handleFinalizePerson}
              inputRef={personInputRef}
              longPressProps={{
                onMouseDown: () => longPress.onMouseDown(p.id),
                onMouseUp: () => longPress.onMouseUp(() => {
                  if (menuId) setMenuId(null);
                  else if (selectedItemId) toggleAssignment(selectedItemId, p.id);
                }),
                onMouseLeave: () => longPress.onMouseLeave(),
                onTouchStart: () => longPress.onTouchStart(p.id),
                onTouchEnd: () => longPress.onMouseUp(() => {
                  if (menuId) setMenuId(null);
                  else if (selectedItemId) toggleAssignment(selectedItemId, p.id);
                }),
              }}
            />
          ))}
        </BottomBar>
      )}
    </div>
  );
}
