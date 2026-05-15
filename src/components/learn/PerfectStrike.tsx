import { useState, useEffect, useRef } from 'react';

interface PerfectStrikeProps {
  visible: boolean;
  onComplete: () => void;
}

export function PerfectStrike({ visible, onComplete }: PerfectStrikeProps) {
  const [badgeIn, setBadgeIn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) {
      setBadgeIn(false);
      return;
    }

    // 徽章入场
    const t1 = setTimeout(() => setBadgeIn(true), 100);
    // 自动消失
    timerRef.current = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Perfect Strike 徽章 */}
      <div
        className={`${
          badgeIn ? 'perfect-badge-in' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-bold text-sm">
          Perfect Strike!
        </div>
      </div>
    </div>
  );
}
