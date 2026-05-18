import { useState, useEffect, useRef, useCallback } from 'react';
import { useComboStore } from '@/stores/comboStore';
import { playSound } from '@/utils/soundEffects';

type ComboEvent = 'increment' | 'reset' | 'new-best';

interface ComboDisplayProps {
  compact?: boolean;
}

interface ComboFlashState {
  combo: number;
  maxCombo: number;
  isNewBest: boolean;
  fadingOut: boolean;
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

export function ComboFlashOverlay() {
  const { currentCombo, maxCombo } = useComboStore();
  const [flash, setFlash] = useState<ComboFlashState | null>(null);
  const prevComboRef = useRef(0);
  const prevMaxRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (currentCombo === 0) {
      clearTimers();
      setFlash(null);
      prevComboRef.current = 0;
      prevMaxRef.current = maxCombo;
      return;
    }

    if (currentCombo > prevComboRef.current) {
      clearTimers();
      const isNewBest = currentCombo > prevMaxRef.current && prevMaxRef.current > 0;
      setFlash({
        combo: currentCombo,
        maxCombo,
        isNewBest,
        fadingOut: false,
      });

      timersRef.current.push(
        setTimeout(() => {
          setFlash((current) => current ? { ...current, fadingOut: true } : current);
        }, 650),
      );
      timersRef.current.push(
        setTimeout(() => setFlash(null), 950),
      );
    }

    prevComboRef.current = currentCombo;
    prevMaxRef.current = maxCombo;
  }, [clearTimers, currentCombo, maxCombo]);

  if (!flash) return null;

  const isRecordTone = flash.combo >= 20 || flash.isNewBest;
  const isMilestone = flash.combo >= 10;

  return (
    <div
      className={`
        pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center
        transition-all duration-300
        ${flash.fadingOut ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
      aria-hidden="true"
    >
      <div
        className={`
          flex items-center gap-3 rounded-brand border px-4 py-2 font-mono font-bold shadow-2xl backdrop-blur-md
          animate-combo-bounce
          ${isRecordTone
            ? 'border-accent-record/50 bg-accent-record/15 text-accent-record shadow-accent-record/20'
            : isMilestone
              ? 'border-accent-primary/50 bg-accent-primary/15 text-accent-primary shadow-accent-primary/20'
              : 'border-bg-surface/70 bg-bg-panel/90 text-text-primary shadow-black/30'}
        `}
      >
        <span className="text-xs tracking-wider opacity-70">COMBO</span>
        <span className={`${isMilestone ? 'text-4xl' : 'text-2xl'} leading-none`}>
          x{flash.combo}
        </span>
        {(flash.isNewBest || isMilestone) && (
          <span
            className={`
              rounded-tool border px-2 py-0.5 text-[10px] leading-none
              ${isRecordTone
                ? 'border-accent-record/40 bg-accent-record/15 text-accent-record'
                : 'border-accent-primary/40 bg-accent-primary/15 text-accent-primary'}
            `}
          >
            {flash.isNewBest ? 'NEW BEST' : `BEST x${flash.maxCombo}`}
          </span>
        )}
      </div>
    </div>
  );
}
