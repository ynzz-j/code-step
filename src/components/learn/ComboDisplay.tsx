import { useState, useEffect, useRef, useCallback } from 'react';
import { useComboStore } from '@/stores/comboStore';
import { playSound } from '@/utils/soundEffects';

type ComboEvent = 'increment' | 'reset' | 'new-best';

interface ComboDisplayProps {
  compact?: boolean;
}

export function ComboDisplay({ compact = false }: ComboDisplayProps) {
  const { currentCombo, maxCombo } = useComboStore();
  const [animEvent, setAnimEvent] = useState<ComboEvent | null>(null);
  const [comboVisible, setComboVisible] = useState(false);
  const [newBestVisible, setNewBestVisible] = useState(false);
  const [newBestFadingOut, setNewBestFadingOut] = useState(false);
  const prevComboRef = useRef(0);
  const prevMaxRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (currentCombo > 0 && !comboVisible) {
      setComboVisible(true);
    }

    if (currentCombo > prevComboRef.current) {
      setAnimEvent('increment');

      // 只在里程碑时播放音效和粒子
      if (currentCombo > prevMaxRef.current && prevMaxRef.current > 0) {
        playSound('new-best');
        setNewBestFadingOut(false);
        setNewBestVisible(true);
        addTimer(() => {
          setNewBestFadingOut(true);
          addTimer(() => setNewBestVisible(false), 500);
        }, 1800);
      } else if ([10, 20, 30].includes(currentCombo)) {
        playSound('combo-milestone');
      }
    } else if (currentCombo === 0 && prevComboRef.current > 0) {
      setAnimEvent('reset');
      playSound('combo-reset');
      const timer = setTimeout(() => {
        setComboVisible(false);
        setAnimEvent(null);
      }, 400);
      timersRef.current.push(timer);
    }

    prevComboRef.current = currentCombo;
    prevMaxRef.current = maxCombo;
  }, [currentCombo, maxCombo, addTimer]);

  useEffect(() => {
    if (animEvent === 'increment') {
      const timer = setTimeout(() => setAnimEvent(null), 300);
      return () => clearTimeout(timer);
    }
  }, [animEvent]);

  // 紧凑模式 - 用于顶部状态栏
  if (compact) {
    if (currentCombo === 0) {
      return <span className="text-[10px] text-text-muted w-16 text-right">COMBO x0</span>;
    }
    const isMilestone = currentCombo >= 10;
    return (
      <div className="flex items-center gap-1.5">
        {newBestVisible && !newBestFadingOut && (
          <span className="text-[10px] text-accent-record animate-pulse">NEW BEST</span>
        )}
        <span
          className={`
            text-xs font-mono font-bold transition-all duration-200
            ${currentCombo >= 20 ? 'text-accent-record' : ''}
            ${currentCombo >= 10 && currentCombo < 20 ? 'text-accent-primary' : ''}
            ${currentCombo < 10 ? 'text-text-primary' : ''}
            ${animEvent === 'increment' ? 'scale-110' : 'scale-100'}
          `}
        >
          COMBO x{currentCombo}
        </span>
        {isMilestone && (
          <span className="text-[10px] text-text-muted">最佳:{maxCombo}</span>
        )}
      </div>
    );
  }

  // 不显示连击的情况
  if (!comboVisible && currentCombo === 0) {
    return null;
  }

  // 完整模式 - 仅在里程碑时放大显示
  const isMilestone = currentCombo >= 10;

  return (
    <div className={`flex items-center justify-center ${isMilestone ? 'h-16' : 'h-10'}`}>
      {newBestVisible && (
        <div className={`absolute -top-1 ${newBestFadingOut ? 'animate-combo-newbest-out' : 'animate-combo-newbest-in'}`}>
          <span className="px-2 py-0.5 text-xs font-bold text-accent-record bg-accent-record/20 rounded-brand border border-accent-record/30">
            NEW BEST!
          </span>
        </div>
      )}

      <div
        className={`
          flex items-baseline gap-1.5 font-mono font-bold select-none
          transition-all duration-300
          ${comboVisible ? 'opacity-100' : 'opacity-0'}
          ${isMilestone ? 'scale-110' : 'scale-100'}
          ${currentCombo >= 20 ? 'text-accent-record' : ''}
          ${currentCombo >= 10 && currentCombo < 20 ? 'text-accent-primary' : ''}
          ${currentCombo < 10 ? 'text-text-secondary' : ''}
          ${animEvent === 'increment' ? 'animate-combo-bounce' : ''}
          ${animEvent === 'reset' ? 'animate-combo-shake' : ''}
        `}
      >
        <span className="text-xs opacity-60 tracking-wider font-normal">COMBO</span>
        <span className={`${isMilestone ? 'text-3xl' : 'text-xl'}`}>
          x{currentCombo}
        </span>
      </div>

      {/* 只在里程碑时显示最佳记录 */}
      {isMilestone && currentCombo > 0 && (
        <div className="text-[10px] text-text-muted mt-0.5">
          最佳: {maxCombo}
        </div>
      )}
    </div>
  );
}
