import { useMemo } from 'react';

export function useSplitLogic(items, people, assignments, receiptTotal, extras = { tax: 0, tip: 0, fees: 0 }) {
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.price, 0), 
    [items]
  );

  const extrasTotal = useMemo(() => 
    (extras.tax || 0) + (extras.tip || 0) + (extras.fees || 0),
    [extras]
  );

  // Any remaining difference between receiptTotal and (subtotal + extrasTotal)
  // could be other adjustments (discounts, unknown fees, etc.)
  const adjustmentTotal = useMemo(() => 
    Math.max(0, receiptTotal - subtotal - extrasTotal),
    [receiptTotal, subtotal, extrasTotal]
  );

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
      shares[p.id] = { 
        subtotal: 0, 
        extras: 0, 
        adjustment: 0,
        unassignedShare: 0, 
        total: 0,
        breakdown: {
          tax: 0,
          tip: 0,
          fees: 0
        }
      }; 
    });

    items.forEach(item => {
      const assigned = assignments[item.id] || [];
      if (assigned.length > 0) {
        const splitPrice = item.price / assigned.length;
        assigned.forEach(pid => {
          if (shares[pid]) {
            shares[pid].subtotal += splitPrice;
          }
        });
      }
    });

    people.forEach(p => {
      const myUnassignedShare = people.length > 0 ? unclaimedTotal / people.length : 0;
      shares[p.id].unassignedShare = myUnassignedShare;

      if (subtotal > 0) {
        const weight = (shares[p.id].subtotal + myUnassignedShare) / subtotal;
        
        // Split each extra prorated
        shares[p.id].breakdown.tax = (extras.tax || 0) * weight;
        shares[p.id].breakdown.tip = (extras.tip || 0) * weight;
        shares[p.id].breakdown.fees = (extras.fees || 0) * weight;
        shares[p.id].extras = extrasTotal * weight;
        shares[p.id].adjustment = adjustmentTotal * weight;
      } else if (people.length > 0) {
        const share = 1 / people.length;
        shares[p.id].breakdown.tax = (extras.tax || 0) * share;
        shares[p.id].breakdown.tip = (extras.tip || 0) * share;
        shares[p.id].breakdown.fees = (extras.fees || 0) * share;
        shares[p.id].extras = extrasTotal * share;
        shares[p.id].adjustment = adjustmentTotal * share;
      }

      shares[p.id].total = shares[p.id].subtotal + shares[p.id].extras + shares[p.id].adjustment + shares[p.id].unassignedShare;
    });

    return shares;
  }, [items, assignments, people, extras, extrasTotal, adjustmentTotal, unclaimedTotal, subtotal]);

  return {
    subtotal,
    extrasTotal,
    adjustmentTotal,
    unassignedItems,
    unclaimedTotal,
    personTotals
  };
}
