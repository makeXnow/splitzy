import { useRef, useCallback } from 'react';

export function useLongPress(onLongPress, ms = 600) {
  const timerRef = useRef(null);
  const isHoldRef = useRef(false);

  const start = useCallback((id) => {
    isHoldRef.current = false;
    timerRef.current = setTimeout(() => {
      isHoldRef.current = true;
      onLongPress(id);
    }, ms);
  }, [onLongPress, ms]);

  const stop = useCallback((onClick) => {
    clearTimeout(timerRef.current);
    if (!isHoldRef.current && onClick) {
      onClick();
    }
    isHoldRef.current = false;
  }, []);

  return {
    onMouseDown: (id, onClick) => start(id),
    onMouseUp: (onClick) => stop(onClick),
    onMouseLeave: () => clearTimeout(timerRef.current),
    onTouchStart: (id) => start(id),
    onTouchEnd: (onClick) => stop(onClick),
  };
}
