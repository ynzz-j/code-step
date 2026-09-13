import { useEffect, useRef, useState } from 'react';

/**
 * 数字缓动：值变化时以 rAF 补间滚动到新值（easeOutCubic）。
 * 用于 WPM / 准确率等大数字展示，避免瞬间跳变。
 */
export function useTweenNumber(target: number, duration = 320): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = displayRef.current;
    if (from === target) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}
