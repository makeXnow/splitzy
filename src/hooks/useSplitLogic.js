import { useMemo } from 'react';

export function useSplitLogic(items, people, assignments, receiptTotal) {
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.price, 0), 
    [items]
  );

  const extrasTotal = Math.max(0, receiptTotal - subtotal);

  const unassignedItems = useMemo(() => 
    items.filter(it => !assignments[it.id] || assignments[it.id].length === 0), 
    [items, assignments]
  );
  
  const unclaimedTotal = useMemo(() => 
    unassignedItems.reduce((sum, item) => sum + item.price, 0), 
    [unassignedItems]
  );

  const personTotals = useMemo(() => {
    const shares = {};
    people.forEach(p => { 
      shares[p.id] = { subtotal: 0, extras: 0, total: 0 }; 
    });

    let claimedSubtotalValue = 0;
    items.forEach(item => {
      const assigned = assignments[item.id] || [];
      if (assigned.length > 0) {
        const splitPrice = item.price / assigned.length;
        assigned.forEach(pid => {
          if (shares[pid]) {
            shares[pid].subtotal += splitPrice;
            claimedSubtotalValue += splitPrice;
          }
        });
      }
    });

    people.forEach(p => {
      if (claimedSubtotalValue > 0) {
        const weight = shares[p.id].subtotal / claimedSubtotalValue;
        shares[p.id].extras = extrasTotal * weight;
      } else if (people.length > 0) {
        shares[p.id].extras = extrasTotal / people.length;
      }
      shares[p.id].total = shares[p.id].subtotal + shares[p.id].extras;
    });

    return shares;
  }, [items, assignments, people, extrasTotal]);

  return {
    subtotal,
    extrasTotal,
    unassignedItems,
    unclaimedTotal,
    personTotals
  };
}
