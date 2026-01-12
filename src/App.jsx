import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Plus, PieChart, Image, Copy, Check } from 'lucide-react';

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

export default function App() {
  // --- UI State ---
  const [viewMode, setViewMode] = useState(VIEW_MODES.RECEIPT);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [copiedError, setCopiedError] = useState(false);

  // --- Data State ---
  const [items, setItems] = useState([]);
  const [extras, setExtras] = useState({ tax: 0, tip: 0, fees: 0 });
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
  const videoRef = useRef(null);

  // --- Logic Hook ---
  const {
    unassignedItems,
    unclaimedTotal,
    personTotals,
    extrasTotal
  } = useSplitLogic(
    items, 
    isAddingPerson && addPreview 
      ? [...people, { id: 'pending-person', name: pendingName || '...', ...addPreview }] 
      : people, 
    assignments, 
    receiptTotal, 
    extras
  );

  // --- Camera Effect ---
  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      if (items.length === 0 && !isScanning && !error) {
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'environment',
              aspectRatio: { ideal: 9/16 }
            }
          });
          setStream(currentStream);
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          setError("Please enable camera access to scan receipts.");
        }
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [items.length, isScanning, error]);

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
      const prompt = `Analyze this receipt image. 

CRITICAL naming rules for the 'name' field:
1. MUST start with 1-2 relevant emojis followed by a space.
2. If the quantity is GREATER THAN 1, follow the emoji with the quantity and 'x' (e.g., '🍚 2x '). 
3. NEVER include '1x' if the quantity is 1.

Correct Examples:
🍚 2x Steamed Rice
💧 3x Bottle Water
🍗 Chicken
🥘 Chicken Pad Thai
🧀🥖 Bread and Cheese

Extract all line items with their prices, the total amount, and the currency symbol. Also extract Tax, Tip, and Fees if they are listed. 
Return ONLY a JSON object with this exact structure: {"items": [{"name": "item name", "price": 0.00}], "tax": 0.00, "tip": 0.00, "fees": 0.00, "total": 0.00, "currencySymbol": "$"}.

IMPORTANT: Do not include summary items like Subtotal, Total, Tax, Tip, or Fees in the 'items' list.`;
      const result = await callAI(prompt, base64, mimeType);
      
      if (result.items) {
        // Double check filtering of summary items
        const filteredItems = result.items.filter(it => {
          const name = (it.name || '').toLowerCase();
          // Filter out items that are completely blank or just noise
          if (!name && !it.price) return false;
          
          const isTaxTipFee = name.includes('tax') || name.includes('tip') || name.includes('fee');
          const isSummary = name.includes('total') || name.includes('subtotal') || name.includes('amount due');
          return !isTaxTipFee && !isSummary;
        });

        setItems(filteredItems.map((it, idx) => ({ 
          ...it, 
          id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}` 
        })));
        setExtras({
          tax: result.tax || 0,
          tip: result.tip || 0,
          fees: result.fees || 0
        });
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

  const capture = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(base64);
    const base64Data = base64.split(',')[1];
    processImage(base64Data, 'image/jpeg');
    
    // Stop stream after capture
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Convert HEIC using heic-decode (pure JS decoder) + canvas for JPEG encoding
  const convertHeicToJpeg = async (file) => {
    // Read file as ArrayBuffer, then convert to Uint8Array (required by heic-decode)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Dynamic import heic-decode
    const decode = (await import('heic-decode')).default;
    
    // Decode HEIC to raw pixel data
    const { width, height, data } = await decode({ buffer: uint8Array });
    
    // Create canvas and draw pixel data
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
    ctx.putImageData(imageData, 0, 0);
    
    // Convert canvas to JPEG blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      }, 'image/jpeg', 0.85);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);
    e.target.value = '';

    try {
      let fileToProcess = file;
      const fileName = (file.name || '').toLowerCase();
      const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
                     file.type === 'image/heic' || file.type === 'image/heif';

      if (isHeic) {
        try {
          fileToProcess = await convertHeicToJpeg(file);
        } catch (conversionError) {
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

      setCapturedImage(base64);
      const base64Data = base64.split(',')[1];
      const mimeType = isHeic ? 'image/jpeg' : base64.split(',')[0].split(':')[1].split(';')[0];
      
      await processImage(base64Data, mimeType);
    } catch (err) {
      setError(err.message || "Failed to process image.");
      setIsScanning(false);
    }
  };

  const startAdding = () => {
    const usedThemes = people.map(p => p.theme);
    const pool = PRESETS.filter(p => !usedThemes.includes(p.theme));
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
          id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
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
    <div 
      className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none"
    >
      <style>{`
        @keyframes echo-ring {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        
        @keyframes pulse-text {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <Header 
        viewMode={viewMode}
        setViewMode={(mode) => {
          setViewMode(mode);
          setSelectedItemId(null);
          setSelectedPersonId(null);
        }}
        onUploadClick={() => {
          setItems([]);
          setExtras({ tax: 0, tip: 0, fees: 0 });
          setReceiptTotal(0);
          setAssignments({});
          setSelectedItemId(null);
          setError(null);
          setCapturedImage(null);
        }}
        isScanning={isScanning}
        hasItems={items.length > 0}
        isAddingPerson={isAddingPerson}
        startAdding={startAdding}
        addPreview={addPreview}
        pendingName={pendingName}
        setPendingName={setPendingName}
        onFinalizePerson={handleFinalizePerson}
        personInputRef={personInputRef}
        currency={currency}
        people={people}
      >
        {people.map(p => {
          const isSelected = viewMode === VIEW_MODES.PEOPLE && selectedPersonId === p.id;
          const isHighlighted = viewMode === VIEW_MODES.RECEIPT && selectedItemId && (assignments[selectedItemId] || []).includes(p.id);
          
          return (
            <PersonCard 
              key={p.id}
              person={p}
              isAssigned={isSelected || isHighlighted}
              isEditing={editingPersonId === p.id}
              isMenuOpen={menuId === p.id}
              total={personTotals[p.id]?.total || 0}
              currency={currency}
              onPress={(id) => {
                if (menuId) setMenuId(null);
                else if (viewMode === VIEW_MODES.RECEIPT) {
                  if (selectedItemId) toggleAssignment(selectedItemId, id);
                } else {
                  setSelectedPersonId(prev => prev === id ? null : id);
                }
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
                onMouseUp: () => longPress.onMouseUp(),
                onMouseLeave: () => longPress.onMouseLeave(),
                onTouchStart: () => longPress.onTouchStart(p.id),
                onTouchEnd: () => longPress.onTouchEnd(),
              }}
            />
          );
        })}
        {isAddingPerson && (
          <PersonCard 
            key="pending-person"
            person={{ id: 'pending-person', name: pendingName || '...', ...addPreview }}
            isAssigned={false}
            isEditing={true}
            isMenuOpen={false}
            total={personTotals['pending-person']?.total || 0}
            currency={currency}
            onPress={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            onCloseMenu={() => {}}
            pendingName={pendingName}
            setPendingName={setPendingName}
            onFinalize={handleFinalizePerson}
            inputRef={personInputRef}
            longPressProps={{}}
          />
        )}
      </Header>
      
      <input 
        type="file" 
        ref={uploadInputRef} 
        className="hidden" 
        accept="image/*,.heic,.heif" 
        onChange={handleFileChange} 
      />

      <main 
        className={`flex-1 overflow-y-auto ${items.length > 0 ? 'p-4 pt-52 max-w-2xl mx-auto w-full' : ''}`}
        style={{ 
          paddingBottom: (items.length > 0) ? '40px' : '0' 
        }}
      >
        {error && (
          <div className="mx-4 mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-start gap-3 relative z-50 mt-24">
            <span className="flex-1 pt-1.5">{error}</span>
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(error);
                  setCopiedError(true);
                  setTimeout(() => setCopiedError(false), 2000);
                }} 
                className="p-2 hover:bg-rose-100 dark:hover:bg-rose-800/40 rounded-lg transition-colors"
                title="Copy error"
              >
                {copiedError ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={() => setError(null)} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-800/40 rounded-lg transition-colors">
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && !isScanning && (
          <div className="relative w-full h-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Capture Button Overlay */}
            <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center px-8">
              <button 
                onClick={() => uploadInputRef.current?.click()}
                className="absolute left-8 w-14 h-14 rounded-2xl bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg"
              >
                <Image className="w-6 h-6" />
              </button>

              <button 
                onClick={capture}
                className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md active:scale-90 transition-all shadow-xl"
              >
                <div className="w-18 h-18 rounded-full bg-white shadow-inner" />
              </button>
            </div>

            {/* Camera Status Label */}
            <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none">
              <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/20">
                Ready to Scan
              </span>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="relative w-full h-full bg-slate-900 overflow-hidden">
            {capturedImage && (
              <img src={capturedImage} className="w-full h-full object-cover opacity-40" alt="Scanning" />
            )}
            
            {/* Animation Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <div className="relative flex flex-col items-center gap-8 scale-75 md:scale-100">
                {/* Isolated Echo Loader */}
                <div className="relative w-32 h-32 flex items-center justify-center" style={{ animation: 'subtle-float 4s ease-in-out infinite' }}>
                  {/* Core Focal Point */}
                  <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] z-10"></div>
                  
                  {/* Concentric Rings */}
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="absolute w-full h-full border-2 border-emerald-500/30 rounded-full" 
                      style={{ 
                        animation: 'echo-ring 2.5s cubic-bezier(0, 0, 0.2, 1) infinite', 
                        animationDelay: `${i * 0.8}s` 
                      }} 
                    />
                  ))}
                  
                  {/* Additional Glow layer */}
                  <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-xl"></div>
                </div>

                {/* Status Text */}
                <div className="flex flex-col items-center gap-2">
                  <span 
                    className="text-emerald-400 font-mono text-sm tracking-[0.3em] uppercase drop-shadow-lg"
                    style={{ animation: 'pulse-text 2s ease-in-out infinite' }}
                  >
                    Scanning...
                  </span>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-3">
            {items.map(item => {
              const isSelected = viewMode === VIEW_MODES.RECEIPT && selectedItemId === item.id;
              const isHighlighted = viewMode === VIEW_MODES.PEOPLE && selectedPersonId && (assignments[item.id] || []).includes(selectedPersonId);

              return (
                <ReceiptItem 
                  key={item.id}
                  item={item}
                  isSelected={isSelected || isHighlighted}
                  onClick={() => {
                    if (viewMode === VIEW_MODES.RECEIPT) {
                      setSelectedItemId(prev => prev === item.id ? null : item.id);
                    } else if (selectedPersonId) {
                      toggleAssignment(item.id, selectedPersonId);
                    }
                  }}
                  currency={currency}
                  assignedPeople={people.filter(p => assignments[item.id]?.includes(p.id))}
                />
              );
            })}

            {/* Extras: Tax, Tip, Fees */}
            {['tax', 'tip', 'fees'].map(key => {
              const value = extras[key];
              if (!value || value <= 0) return null;
              return (
                <div 
                  key={key}
                  className="bg-slate-200/50 dark:bg-slate-900/50 p-5 rounded-[1.75rem] border-2 border-transparent shadow-sm flex justify-between items-center text-slate-500 dark:text-slate-400 cursor-default"
                >
                  <h3 className="font-bold pr-4 truncate text-lg capitalize">
                    {key}
                  </h3>
                  <span className="font-black text-slate-700 dark:text-slate-300 text-lg whitespace-nowrap">
                    {currency}{value.toFixed(2)}
                  </span>
                </div>
              );
            })}

            <div className="bg-slate-200 dark:bg-slate-900 p-5 rounded-[1.75rem] border-2 border-slate-300 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white cursor-default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 text-slate-900 dark:text-white shrink-0 shadow-sm">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black leading-tight">Final Balance</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black leading-none">{currency}{receiptTotal.toFixed(2)}</p>
                  <p className={`text-[11px] font-black mt-1 ${unclaimedTotal > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {unclaimedTotal > 0 ? `${currency}${unclaimedTotal.toFixed(2)} unassigned` : 'Perfectly Split! 🎉'}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-4 px-2">
              <div className="h-px w-1/2 mx-auto bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Combined Breakdown Card */}
            {people.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Personal Breakdowns</h2>
                  <div className="h-1 w-12 bg-indigo-500 rounded-full" />
                </div>
                
                <div className="space-y-12">
                  {people.map(person => (
                    <PersonSummary 
                      key={person.id}
                      person={person}
                      items={items}
                      assignments={assignments}
                      currency={currency}
                      personTotal={personTotals[person.id]?.total || 0}
                      personExtras={personTotals[person.id]?.extras || 0}
                      unassignedShare={personTotals[person.id]?.unassignedShare || 0}
                      breakdown={personTotals[person.id]?.breakdown || {}}
                      adjustment={personTotals[person.id]?.adjustment || 0}
                      peopleCount={people.length}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Original Uploaded Image Card */}
            {capturedImage && (
              <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="relative aspect-[3/4] w-full rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={capturedImage} 
                    alt="Original Receipt" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 text-slate-900 dark:text-white">
                      Original Receipt
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}
