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

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  return {
    onMouseDown: (id) => start(id),
    onMouseUp: () => stop(),
    onMouseLeave: () => stop(),
    onTouchStart: (id) => start(id),
    onTouchEnd: () => stop(),
  };
}
